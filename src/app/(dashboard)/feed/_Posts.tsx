import useFetcher from "@/hooks/useFetcher";
import EventService from "@/services/Event";
import { Event, Post } from "@/types";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import PostService from "@/services/Post";
import Image from "next/image";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { data, wrapper, loading } = useFetcher<Post[]>();

  useEffect(() => {
    const postService = new PostService();
    wrapper(postService.findAll);

    const interval = setInterval(async () => {
      await wrapper(postService.findAll);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  return (
    <div className="!flex flex-col gap-3">
      {posts.length === 0 ? (
        <p className="text-xs text-center text-gray-500 py-4">No posts</p>
      ) : (
        posts.map((post) => {
          return (
            <div key={post.id} className="border-b py-3 px-3">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {(
                      post.owner.displayName.split(" ")[0][0] ?? ""
                    ).toUpperCase()}
                    {(
                      post.owner.displayName.split(" ")[1][0] ?? ""
                    ).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <p>
                    <span className="font-medium capitalize">
                      {post.owner.displayName}
                    </span>{" "}
                    .{" "}
                    <span className="text-sm">
                      {moment(post.timestamp.toDate()).format("MMM DD")}
                    </span>
                  </p>

                  <p className="">{post.post}</p>
                  {post.photoURL && (
                    <div className="relative mt-1 rounded-xl overflow-hidden">
                      <Image
                        src={post.photoURL}
                        // fill
                        alt=""
                        width={100}
                        height={100}
                        className="h-auto w-full"
                        priority
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
