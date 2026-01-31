'use client';

import { remove } from "@/app/actions/post";

import { useState } from "react";
import { FocusTrap } from "focus-trap-react";

import { LoaderCircle } from "lucide-react";


type Props = {
    postId: string;
    authorId: string;
    onDelete: () => void;
    onClose: () => void;
};

const DeletePost = (props: Props) => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleDelete = async () => {
        setIsPending(true);
        const req = await remove(props.postId, props.authorId);

        if (req.ok) {
            setIsPending(false);
            props.onDelete();
        } else {
            setIsPending(false);
            setError(req.message || 'An unknown error occurred');
        };
    };

    const handleCancel = async () => {
        props.onClose();
    };

    return (
        <div className="modal">
            <FocusTrap>
                <div className="modal-content flex flex-col gap-4">
                    <div className="flex flex-col ">
                        <h4 className="text-error text-center font-semibold">Delete Post</h4>
                        <p>Are you sure you want to delete this post? This is an irreversible action.</p>
                        <p className="error">{error.length > 0 && error}</p>
                    </div>

                    <div className="flex flex-row justify-center gap-8">
                        <button
                            className="danger"
                            onClick={handleDelete}
                            onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
                            disabled={isPending}>
                            { isPending ?
                                    <LoaderCircle className="icon animate-spin duration-200" />
                                : 'Delete'
                            }
                        </button>

                        <button
                            className="neutral"
                            onClick={handleCancel}
                            onKeyDown={(e) => e.key === 'Enter' && handleCancel()}>
                            Cancel
                        </button>
                    </div>
                </div>
            </FocusTrap>
        </div>
    );
};

export default DeletePost;