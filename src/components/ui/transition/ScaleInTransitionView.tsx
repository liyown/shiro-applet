import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";

export default function ScaleInTransitionView({
  children,
  delay = 0,
  className,
}: {
  children: any;
  delay?: number;
  className?: any;
}) {
  const [animation, setAnimation] = useState({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const animationSteps = Taro.createAnimation({
        duration: 300,
        timingFunction: "ease", // 平滑的过渡效果，无弹性
        transformOrigin: "50% 50%", // 从中心缩放
        delay: delay,
      });

      // 逐渐缩放和显影
      animationSteps.opacity(1).step(); // 最终状态：正常大小、不透明

      setAnimation(animationSteps.export());
    }, 0);

    return () => clearTimeout(timeoutId); // 清除定时器避免内存泄漏
  }, [delay]);

  const initialStyle = {
    opacity: 0,
  };

  return (
    <View style={initialStyle} animation={animation} className={className}>
      {children}
    </View>
  );
}
