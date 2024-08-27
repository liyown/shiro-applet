import { apiClient } from "~/taro-axios/taro-axios";
import { Posts } from "~/pages/index/components/post-item";
import { useLoaderData } from "react-router-dom";
import TaroVirtualList from "~/components/VirtualList";
import { View } from "@tarojs/components";
import BottomToUpTransitionView from "~/components/ui/transition/BottomToUpTransitionView";
import { useState } from "react";
import Container from "~/components/ui/container";

export async function loader() {
  const postLists = await apiClient.post.getList(1, 10, {
    sortBy: "created",
    sortOrder: -1,
    truncate: 100,
  });
  console.log(postLists);
  return { postLists };
}

export default function App() {
  const { postLists } = useLoaderData() as { postLists: any };
  const list = postLists.data.data;

  const [allPosts, setAllPosts] = useState(list);
  const [page, setPage] = useState(1);

  // 渲染列表Item
  const renderFunc = (item, index) => {
    return (
      <Container>
        {index < 10 ? (
          <BottomToUpTransitionView
            key={item.id}
            className="mb-2"
            delay={index * 100}
          >
            <Posts data={item} />
          </BottomToUpTransitionView>
        ) : (
          <BottomToUpTransitionView key={item.id} className="mb-2">
            <Posts data={item} />
          </BottomToUpTransitionView>
        )}
      </Container>
    );
  };
  const onPageScrollToLower = async () => {
    console.log("onPageScrollToLower");
    const newPostLists = (await apiClient.post.getList(page + 1, 10, {
      sortBy: "created",
      sortOrder: -1,
      truncate: 100,
    })) as any;
    setPage(page + 1);
    setAllPosts([...allPosts, ...newPostLists.data.data]);
  };
  return (
    <View className="backgroundColor">
      {/*列表*/}
      <TaroVirtualList
        autoScrollTop={false}
        listType="multi"
        list={allPosts}
        pageNum={page}
        segmentNum={10}
        onRender={renderFunc}
        scrollViewProps={{
          onScrollToLower: onPageScrollToLower,
          lowerThreshold: 50,
          style: {
            height: "100vh",
          },
        }}
        screenNum={2}
      />
    </View>
  );
}

