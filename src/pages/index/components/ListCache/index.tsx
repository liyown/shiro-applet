import BottomToUpTransitionView from "~/components/ui/transition/BottomToUpTransitionView";
import { Posts } from "~/pages/index/components/post-item";
import { View } from "@tarojs/components";
import Container from "~/components/ui/container";

let renderedIndexes = new Set<number>();

export default function ListComponentCache({ data }) {
  // 渲染列表Item
  const renderFunc = (item, index) => {
    const isAnimated = renderedIndexes.has(index);
    if (!isAnimated) {
      renderedIndexes.add(index); // 将索引缓存起来
    }
    if (isAnimated) {
      return (
        <Container>
          <Posts data={item} className="mb-2" />
        </Container>
      );
    }

    return (
      <Container>
        <BottomToUpTransitionView
          key={item.id}
          className="mb-2"
          delay={index * 100} // 已动画过的索引不再延迟
        >
          <Posts data={item} />
        </BottomToUpTransitionView>
      </Container>
    );
  };

  return <View>{renderFunc(data.item, data.index)}</View>;
}
