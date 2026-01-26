'use client';

import Image from "next/image";
import { UpdatePostState } from "@/lib/definitions";
import { dateToReadable } from "@/lib/helpers";
import { useToast } from "@/context/ToastContext";

import { like, repost, update } from "@/app/actions/post";

import { Heart, Repeat, Share2, EllipsisVertical } from "lucide-react";
import { useActionState, useState, useRef, useEffect } from "react";

type Props = {
    id: number;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    likes: number;
    reposts: number;
    shares: number;
    comments: number;
    createdAt: Date;
    liked?: boolean;
    reposted?: boolean;
    shared?: boolean;
    onUpdate: ({
        like,
        repost,
        share
    }: {
        like?: '+' | '-' | null;
        repost?: '+' | '-' | null;
        share?: true | false | null;
    }) => void;
};

const initialState: UpdatePostState = {
    ok: false,
    message: "",
    errors: {
        content: null
    }
};


const Post = (props: Props) => {
    const [state, action, isPending] = useActionState<UpdatePostState, FormData>(update, initialState);
    const { showToast } = useToast();
    const interactionPending = useRef<boolean>(false);
    const [liked, setLiked] = useState<boolean>(props.liked? true : false);
    const [reposted, setReposted] = useState<boolean>(props.reposted? true : false);
    // const [shared, setShared] = useState<boolean>(false);

    useEffect(() => {
        setLiked(props.liked ?? false);
        setReposted(props.reposted ?? false);
        // setShared(props.shared ?? false);
    }, [props.liked, props.reposted]);

    console.log(props)


    const handleLike = async () => {
        if (interactionPending.current) return;

        interactionPending.current = true;
        const x = await like(String(props.id), !liked);

        if (x.ok) {
            console.log('response', x)
            setLiked(!liked);
            props.onUpdate({
                like: !liked ? '+' : '-'
            });
        };

        interactionPending.current = false;
    };

    const handleRepost = async () => {
        if (interactionPending.current) return;

        interactionPending.current = true;
        const x = await repost(String(props.id), !reposted);

        if (x.ok) {
            setReposted(!reposted);
            props.onUpdate({
                repost: !reposted ? '+' : '-'
            });

            if (!reposted) {
            showToast('Reposted', 'You have reposted this post.', 'success')
            } else {
                showToast('Action Undone', 'You have removed your repost.', 'info')
            };
        };

        interactionPending.current = false;
    };

    const handleShare = async () => {
        // if (interactionPending.current) return;

        // interactionPending.current = true;
        
        navigator.clipboard.writeText(`Check out this post by ${props.authorName}: ${window.location.origin}/post/${props.id}`);

        // const x = await share(String(props.id), !shared);

        // if (x.ok) {
        //     setShared(!shared);
        //     props.onUpdate({
        //         share: !shared
        //     });
        // };

        showToast('Link Copied', 'You can now share this post.', 'info');

        // interactionPending.current = false;
    };

    // TODO: handleComment
    const handleComment = () => {

    };

    return (
        <section id={`post-${props.id}`} className="w-full sm:w-3/4 md:w-1/2 lg:w-2/5 flex flex-col gap-2 p-4 rounded-sm bg-surface">

            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-2">
                    <Image
                        height={256}
                        width={256}
                        className="h-8 w-8 rounded-full"
                        src={props.authorAvatar}
                        alt={`${props.authorName}'s avatar`}
                    />

                    <p className="text-text-primary font-bold">{props.authorName}</p>
                </div>

                <p className="text-xs text-text-secondary">{dateToReadable(props.createdAt)}</p>
                
                {/* { props.authorId ===
                    <EllipsisVertical/>
                } */}
            </div>

            <p className="text-text-secondary">{props.content}</p>

            <div className="flex flex-row justify-center gap-6 mt-2">
                <div className="flex flex-row items-center gap-1 cursor-pointer hover:text-primary">
                    <Heart
                        className={
                            liked ? 'fill-error text-error icon'
                            : 'fill-surface text-text-secondary hover:fill-error hover:text-error icon'
                        }
                        size={24}
                        onClick={handleLike}
                    />
                    <span>{props.likes}</span>
                </div>
                <div className="flex flex-row items-center gap-1 cursor-pointer hover:text-primary">
                    <Repeat
                        className={
                            reposted ? 'text-success icon'
                            : 'text-text-secondary hover:text-success icon'
                        }
                        size={24}
                        onClick={handleRepost}
                    />
                    <span>{props.reposts}</span>
                </div>
                <div className="flex flex-row items-center gap-1 cursor-pointer hover:text-primary">
                    <Share2
                        className='fill-text-secondary text-text-secondary icon hover:fill-accent hover:text-accent'
                            // shared ? 'fill-accent text-accent icon'
                            // : "fill-text-secondary text-text-secondary hover:fill-accent hover:text-accent"}
                        size={24}
                        onClick={handleShare}
                    />
                    {/* <span>{props.shares}</span> */}
                </div>
            </div>
        </section>
    );
};

export default Post;