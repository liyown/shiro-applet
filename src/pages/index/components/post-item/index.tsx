import { Image, View } from "@tarojs/components";
import RemoveMarkdown from "remove-markdown";
import MdiClockOutline from "~/icon/clock.svg";
import "~/pages/index/components/post-item/index.scss";
import { RelativeTime } from "~/components/ui/relative-time";
import { Fragment, memo } from "react";
import FeHash from "~/icon/FeHash.svg";
import Eye from "~/icon/Eye.svg";
import { Link } from "react-router-dom";

export const Posts = memo<{ data: any }>(function App({ data }) {
  // console.log(data);
  const displayText = RemoveMarkdown(data.text);
  const categorySlug = data.category?.slug;
  const postLink = `/posts/${categorySlug}/${data.slug}`;
  return (
    <Link to={postLink}>
      <View className="font-sans drop-shadow-2xl backdrop-blur-md">
        <div className="mx-2 p-4 frosted-glass  rounded-lg">
          <h1 className="text-xl font-bold text-gray-800 mb-2">{data.title}</h1>
          <p className="text-gray-700 text-base leading-relaxed ">
            {displayText}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
            <div className="flex items-center">
              <Image
                src={MdiClockOutline}
                className="inline-block w-3 h-3 mx-1"
              />
              <RelativeTime date={data.created} />
              {!!data.category && (
                <Fragment>
                  <Image src={FeHash} className="inline-block w-3 h-3 ml-1 " />
                  <span className="ml-1">{data.category.name}</span>
                </Fragment>
              )}
              {data.tags?.length ? (
                <>
                  {" "}
                  /{" "}
                  {data.tags.map((tag, index) => {
                    const isLast = index === data.tags!.length - 1;
                    return (
                      <Fragment key={tag}>
                        {tag}
                        {!isLast && ", "}
                      </Fragment>
                    );
                  })}
                </>
              ) : (
                ""
              )}
              {!!data.count?.read && (
                <div className="flex min-w-0 items-center space-x-1">
                  <Image src={Eye} className=" w-3 h-3 mx-1 " />
                  <span className="min-w-0 truncate">{data.count.read}</span>
                </div>
              )}
            </div>
            <a href="#" className="text-pink-500">
              阅读全文 →
            </a>
          </div>
        </div>
      </View>
    </Link>
  );
});
