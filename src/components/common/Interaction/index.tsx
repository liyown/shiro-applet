import { Image, View } from "@tarojs/components";
import ThumbUp from "~/icon/ThumbsUp.svg";
import Share from "~/icon/Share.svg";
import Back from "~/icon/Back.svg";
import Taro, { usePageScroll } from "@tarojs/taro";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [animation, setAnimation] = useState<any>();
  const [lastScrollTop, setLastScrollTop] = useState<number>(0);
  const navigate = useNavigate();
  const appearAnimation = Taro.createAnimation({
    duration: 200,
    timingFunction: "ease",
  })
    .translateX(0)
    .opacity(1)
    .step();

  const disappearAnimation = Taro.createAnimation({
    duration: 200,
    timingFunction: "ease",
  })
    .translateX(10)
    .opacity(0)
    .step();

  const appearAnimationExport = useMemo(
    () => appearAnimation.export(),
    [appearAnimation]
  );
  const disappearAnimationExport = useMemo(
    () => disappearAnimation.export(),
    [disappearAnimation]
  );

  let scrollTimeout: any = null;

  usePageScroll((payload) => {
    if (payload.scrollTop < 100) {
      setAnimation(appearAnimationExport);
      return;
    }

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      console.log(payload.scrollTop - lastScrollTop);

      if (payload.scrollTop > lastScrollTop) {
        setAnimation(disappearAnimationExport);
      } else {
        setAnimation(appearAnimationExport);
      }

      setLastScrollTop(payload.scrollTop);
    }, 50); // 100ms 的延迟，你可以根据需要调整
  });

  // console.log(window.history);
  const backToLastView = () => {
    // 判断是否有上一页
    navigate("/");
  };

  return (
    <>
      <View
        className="flex items-center justify-center bottom-4 left-1/3 text-white fixed z-40"
        animation={animation}
      >
        <View className="mx-2 text-red-300">
          <Image src={ThumbUp} className="w-8 h-8" />
        </View>
        <View className="mx-2">
          <Image src={Share} className="w-8 h-8" />
        </View>
        <View className="mx-2" onClick={backToLastView}>
          <Image src={Back} className="w-8 h-8" />
        </View>
      </View>
    </>
  );
}
