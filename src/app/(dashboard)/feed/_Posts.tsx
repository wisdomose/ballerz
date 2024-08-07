import useFetcher from "@/hooks/useFetcher";
import EventService from "@/services/Event";
import { Event, Post, ROLES } from "@/types";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import PostService from "@/services/Post";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { FiTrash } from "react-icons/fi";
import { useUserStore } from "@/store/user";
import { toast } from "react-toastify";

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
          return <PostDetail post={post} key={post.id} />;
        })
      )}
    </div>
  );
}

function PostDetail({ post }: { post: Post }) {
  const { data, wrapper, loading } = useFetcher<boolean>();
  const user = useUserStore((s) => s.user);

  async function deleteHandler() {
    const postService = new PostService();
    await wrapper(() => postService.deleteOne(post.id));
  }

  useEffect(() => {
    if (data) toast.success("Post deleted");
  }, [data]);
  return (
    <div className="border-b py-3 px-3">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>
            {(post.owner.displayName.split(" ")[0][0] ?? "").toUpperCase()}
            {(post.owner.displayName.split(" ")[1][0] ?? "").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="w-full relative">
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
        {user?.role === ROLES.ADMIN && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            className="flex-shrink-0"
            onClick={deleteHandler}
          >
            {loading ? (
              <Spinner className="h-4 w-4 animate-spin" />
            ) : (
              <FiTrash className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
