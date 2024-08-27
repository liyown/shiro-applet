import { Component, PureComponent } from "react";
import Taro, { createSelectorQuery, getSystemInfoSync } from "@tarojs/taro";
import { View, ScrollView, Block } from "@tarojs/components";
import PropTypes from "prop-types";
import { VirtualListProps, VirtualListState } from "~/../types/VirtualList";
import { throttle, isH5 } from "~/lib/utils";

type ListItem = any;

class VirtualListItem extends PureComponent<{
  item: ListItem;
  index: number;
  onRender: Function;
}> {
  shouldComponentUpdate(
    nextProps: Readonly<{ item: ListItem; index: number; onRender: Function }>
  ) {
    return (
      this.props.item !== nextProps.item || this.props.index !== nextProps.index
    );
  }

  render() {
    const { item, index, onRender } = this.props;
    return onRender(item, index);
  }
}

export default class VirtialList extends Component<
  VirtualListProps,
  VirtualListState
> {
  public static propTypes = {
    list: PropTypes.array.isRequired,
    listId: PropTypes.string,
    listType: PropTypes.string,
    segmentNum: PropTypes.number,
    screenNum: PropTypes.number,
    autoScrollTop: PropTypes.bool,
    scrollViewProps: PropTypes.object,
    onRender: PropTypes.func.isRequired,
    onBottom: PropTypes.func,
    onComplete: PropTypes.func,
    onRenderTop: PropTypes.func,
    onRenderBottom: PropTypes.func,
    onGetScrollData: PropTypes.func,
  };

  public static defaultProps: VirtualListProps = {
    list: [],
    pageNum: 1,
    listId: "zt-virtial-list",
    listType: "single",
    segmentNum: 10,
    screenNum: 2,
    scrollViewProps: {},
    className: "",
    autoScrollTop: true,
    onRender: () => <View />,
  };

  private pageHeightArr: number[] = [];
  private initList: ListItem[][] = [];
  private windowHeight = 0;
  private currentPage = Taro.getCurrentInstance();
  private observer: IntersectionObserver | null = null;

  constructor(props: VirtualListProps) {
    super(props);
    this.state = {
      wholePageIndex: 0,
      twoList: [],
      isComplete: false,
      innerScrollTop: 0,
    };
  }

  componentDidMount() {
    this.getSystemInformation();
    this.updateList(this.props.list, this.props.listType);
  }

  componentDidUpdate(prevProps: VirtualListProps) {
    if (
      prevProps.list !== this.props.list ||
      prevProps.listType !== this.props.listType
    ) {
      this.updateList(this.props.list, this.props.listType);
    }
  }

  getSystemInformation() {
    try {
      const res = getSystemInfoSync();
      this.windowHeight = res.windowHeight;
    } catch (err) {
      console.error(`获取系统信息失败：${err}`);
    }
  }

  updateList(list: ListItem[], listType: string) {
    if (listType === "single") {
      this.formatList(list);
    } else if (listType === "multi") {
      this.formatMultiList(list, this.props.pageNum);
    }
  }

  formatList(list: ListItem[]) {
    this.segmentList(list);
    this.setState(
      {
        twoList: this.initList.slice(0, 1),
      },
      () => {
        Taro.nextTick(() => this.setHeight(list));
      }
    );
  }

  formatMultiList(list: ListItem[], pageNum: number) {
    this.segmentList(list);
    const twoList = [...this.state.twoList];
    twoList[pageNum - 1] = this.initList[pageNum - 1];
    this.setState(
      {
        twoList,
        wholePageIndex: pageNum - 1,
      },
      () => {
        Taro.nextTick(() => this.setHeight(list));
      }
    );
  }

  segmentList(list: ListItem[]) {
    const { segmentNum } = this.props;
    let arr: ListItem[] = [];
    const segmentedList: ListItem[][] = [];

    list.forEach((item, index) => {
      arr.push(item);
      if ((index + 1) % segmentNum === 0) {
        segmentedList.push(arr);
        arr = [];
      }
    });

    if (arr.length) {
      segmentedList.push(arr);
    }

    if (segmentedList.length <= 1) {
      this.handleComplete();
    }

    this.initList = segmentedList;
  }

  handleComplete() {
    this.setState({ isComplete: true }, () => {
      this.props.onComplete?.();
    });
  }

  setHeight(list: ListItem[]) {
    const query = createSelectorQuery();
    query
      .select(`#${this.props.listId} .wrap_${this.state.wholePageIndex}`)
      .boundingClientRect();
    query.exec((res) => {
      if (list.length) {
        this.pageHeightArr.push(res?.[0]?.height || 0);
      }
    });
    this.handleObserve();
  }

  handleObserve() {
    if (isH5) {
      this.webObserve();
    } else {
      this.miniObserve();
    }
  }

  webObserve() {
    const { listId } = this.props;
    const targets = document.querySelectorAll(
      `#${listId} .zt-main-list > taro-view-core`
    );
    const options = {
      root: document.querySelector(`#${listId}`),
      rootMargin: "500px 0px",
    };
    this.observer = new IntersectionObserver(this.observerCallBack, options);
    targets.forEach((target) => this.observer?.observe(target));
  }

  miniObserve() {
    const { listId, screenNum } = this.props;
    const scrollHeight =
      this.props.scrollViewProps?.style?.height || this.windowHeight;
    const observer = Taro.createIntersectionObserver(
      this.currentPage.page
    ).relativeToViewport({
      top: screenNum * scrollHeight,
      bottom: screenNum * scrollHeight,
    });
    observer.observe(`#${listId} .wrap_${this.state.wholePageIndex}`, (res) => {
      if (res?.intersectionRatio <= 0) {
        this.state.twoList[this.state.wholePageIndex] = {
          height: this.pageHeightArr[this.state.wholePageIndex],
        };
        this.setState({ twoList: [...this.state.twoList] });
      } else if (!this.state.twoList[this.state.wholePageIndex]?.length) {
        this.state.twoList[this.state.wholePageIndex] =
          this.initList[this.state.wholePageIndex];
        this.setState({ twoList: [...this.state.twoList] });
      }
    });
  }

  observerCallBack = (entries: IntersectionObserverEntry[]) => {
    const twoList = [...this.state.twoList];
    entries.forEach((entry) => {
      const screenIndex = entry.target["data-index"];
      if (entry.isIntersecting) {
        twoList[screenIndex] = this.initList[screenIndex];
      } else {
        twoList[screenIndex] = { height: this.pageHeightArr[screenIndex] };
      }
    });
    this.setState({ twoList });
  };

  handleScroll = throttle(
    (event: any) => {
      this.props.onGetScrollData?.({ [this.props.listId]: event });
      this.props.scrollViewProps?.onScroll?.(event);
    },
    300,
    300
  );

  renderNext = () => {
    const { onBottom, listType, scrollViewProps, list } = this.props;
    if (listType === "single") {
      const nextIndex = this.state.wholePageIndex + 1;
      if (!this.initList[nextIndex]?.length) {
        this.handleComplete();
        return;
      }
      onBottom?.();
      this.setState({ wholePageIndex: nextIndex }, () => {
        const twoList = [...this.state.twoList];
        twoList[nextIndex] = this.initList[nextIndex];
        this.setState({ twoList }, () =>
          Taro.nextTick(() => this.setHeight(list))
        );
      });
    } else if (listType === "multi") {
      scrollViewProps?.onScrollToLower?.();
    }
  };

  render() {
    const { twoList, isComplete, innerScrollTop } = this.state;
    const {
      segmentNum,
      scrollViewProps,
      onRenderTop,
      onRenderBottom,
      onRenderLoad,
      listId,
      className,
      autoScrollTop,
      onRender,
    } = this.props;

    const scrollStyle = { height: "100%" };
    const scrollProps = {
      ...scrollViewProps,
      scrollTop:
        autoScrollTop && innerScrollTop === 0 ? 0 : scrollViewProps?.scrollTop,
    };

    return (
      <ScrollView
        scrollY
        id={listId}
        style={scrollStyle}
        onScrollToLower={this.renderNext}
        lowerThreshold={250}
        className={`zt-virtual-list-container ${className}`}
        {...scrollProps}
        onScroll={this.handleScroll}
      >
        <View className="zt-scroll-content">
          {onRenderTop?.()}
          <View className="zt-main-list">
            {twoList.map((item, pageIndex) => (
              <View
                key={pageIndex}
                data-index={pageIndex}
                className={`zt-wrap-item wrap_${pageIndex}`}
              >
                {item?.length ? (
                  <Block>
                    {item.map((el, index) => (
                      <VirtualListItem
                        key={index}
                        item={el}
                        index={pageIndex * segmentNum + index}
                        onRender={onRender}
                      />
                    ))}
                  </Block>
                ) : (
                  <View style={{ height: `${item?.height}px` }} />
                )}
              </View>
            ))}
          </View>
          {onRenderLoad?.() && (
            <View className="zt-loading-text">{onRenderLoad()}</View>
          )}
          {isComplete && onRenderBottom?.()}
        </View>
      </ScrollView>
    );
  }
}
