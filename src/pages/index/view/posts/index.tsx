import { apiClient } from "~/taro-axios/taro-axios";
import { useLoaderData } from "react-router-dom";
import TaroVirtualList from "~/components/VirtualList";
import { View } from "@tarojs/components";
import { useState } from "react";
import ListLoading from "~/components/ui/ListLoading";
import ListComponentCache from "~/pages/index/components/ListCache";

export async function loader() {
  const postLists = await apiClient.post.getList(1, 3, {
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
    return <ListComponentCache key={item.id} data={{ item, index }} />;
  };
  const onPageScrollToLower = async () => {
    const newPostLists = (await apiClient.post.getList(page + 1, 3, {
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
        segmentNum={3}
        onRender={renderFunc}
        onRenderBottom={onCompleted}
        onRenderLoad={() => <ListLoading />}
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

const onCompleted = () => {
  return (
    <View className="text-center text-gray-500 text-sm">
      <View>已经到底了</View>
    </View>
  );
};
