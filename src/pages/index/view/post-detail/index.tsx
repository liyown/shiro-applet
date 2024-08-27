import Interaction from "~/components/common/Interaction";
// @ts-ignore
import towxml from "~/towxml/index";
import { apiClient } from "~/taro-axios/taro-axios";
import { useLoaderData, useNavigation } from "react-router-dom";
import Container from "~/components/ui/container";
import { View } from "@tarojs/components";
import BottomToUpTransitionView from "~/components/ui/transition/BottomToUpTransitionView";

export async function loader({ params }) {
  const category = params.category;
  const slug = params.slug;

  const postData = await apiClient.post.getPost(category, slug);
  console.log(postData);

  return { postData };
}

export default function App() {
  const postData = useLoaderData() as { postData: any };
  const navigation = useNavigation();

  console.log("navigation", navigation.state);

  const html = postData.postData.data.text;
  const result = towxml(html, "markdown");
  return (
    <>
      <Container>
        <BottomToUpTransitionView>
          <View className="text-xl font-bold text-gray-800 mx-5">
            {postData.postData.data.title}
          </View>
          {/* @ts-ignore */}
          <to-wxml nodes={result} />
        </BottomToUpTransitionView>
        <Interaction />
      </Container>
    </>
  );
}
