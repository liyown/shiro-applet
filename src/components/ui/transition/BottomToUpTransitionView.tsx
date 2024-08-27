import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";

export default function BottomToUpTransitionView({
  children,
  delay = 0,
  className,
} : {  children: any,
  delay?: number,
  className?:any} ) {
  const [animation, setAnimation] = useState({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const animationSteps = Taro.createAnimation({
        duration: 300,
        timingFunction: "ease-out", // 采用更平滑的过渡效果
        transformOrigin: "50% 50%",
        delay: delay,
      });
      //
      animationSteps.translateY(-6).opacity(0.8).step();
      animationSteps.translateY(4).opacity(0.85).step();
      animationSteps.translateY(0).opacity(0.9).step();
      animationSteps.translateY(-2).opacity(0.95).step();
      animationSteps.translateY(0).opacity(1).step();

      setAnimation(animationSteps.export());
    }, 0); // 小延迟确保初始样式应用完成

    return () => clearTimeout(timeoutId); // 清除定时器避免内存泄漏
  }, [delay]);

  const initialStyle = {
    transform: "translateY(48px)",
    opacity: 0.001,
  };

  return (
    <View style={initialStyle} animation={animation} className={className}>
      {children}
    </View>
  );
}
