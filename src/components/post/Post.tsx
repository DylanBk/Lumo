'use client';

import Image from "next/image";
import { dateToReadable } from "@/lib/helpers";

import Toast from "@/components/Toast";

import { useState } from "react";
import { Heart, Repeat, Share2 } from "lucide-react";
import { ToastType } from "@/lib/definitions";

type Props = {
    id: number;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    likes: number;
    reposts: number;
    comments: number;
    createdAt: Date;
};

const Post = (props: Props) => {
    const [toast, setToast] = useState<ToastType>({
        title: '',
        context: 'info',
        content: '',
        visible: false,
        onClose: () => {
            setToast({
                ...toast,
                title: '',
                context: 'info',
                content: '',
                visible: false
            });
        }
    });

    const handleLike = () => {
    };

    const handleRepost = () => {
        // update reposts and stuff

        setToast({
            title: 'Reposted',
            context: 'success',
            content: 'You have reposted this post.',
            visible: true,
            onClose: () => {
                setToast({
                    ...toast,
                    title: '',
                    context: 'info',
                    content: '',
                    visible: false
                })
            }
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(`Check out this post by ${props.authorName}: ${window.location.origin}/post/${props.id}`);

        setToast({
            title: 'Copied to clipboard',
            context: 'info',
            content: 'You can now share this post.',
            visible: true,
            onClose: () => {
                setToast({
                    ...toast,
                    title: '',
                    context: 'info',
                    content: '',
                    visible: false
                })
            }
        });
    };

    return (
        <section id={`post-${props.id}`} className="w-full sm:w-3/4 md:w-1/2 lg:w-2/5 flex flex-col gap-2 p-4 rounded-sm bg-surface">

            <Toast
                title={toast.title}
                context={toast.context}
                content={toast.content}
                visible={toast.visible}
                onClose={toast.onClose}
            />

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
            </div>

            <p className="text-text-secondary">{props.content}</p>

            <div className="flex flex-row justify-center gap-6 mt-2">
                <div className="flex flex-row items-center gap-1 cursor-pointer hover:text-primary">
                    <Heart
                        className="fill-surface text-text-secondary hover:fill-error hover:text-error icon"
                        size={24}
                        onClick={handleLike}
                    />
                    <span>{props.likes}</span>
                </div>
                <div className="flex flex-row items-center gap-1 cursor-pointer hover:text-primary">
                    <Repeat
                        className="text-text-secondary hover:text-success icon"
                        size={24}
                        onClick={handleRepost}
                    />
                    <span>{props.reposts}</span>
                </div>
                <div className="flex flex-row items-center gap-1 cursor-pointer hover:text-primary">
                    <Share2
                        className="fill-text-secondary text-text-secondary hover:fill-accent hover:text-accent icon"
                        size={24}
                        onClick={handleShare}
                    />
                    <span>{props.comments}</span>
                </div>
            </div>
        </section>
    );
};

export default Post;