import { View } from "@tarojs/components";
import { useNavigation } from "react-router-dom";
import Loading from "~/components/ui/loading";

export default function App({ children }) {
  const navigate = useNavigation();
  return <View>{navigate.state == "loading" ? <Loading /> : children}</View>;
}
