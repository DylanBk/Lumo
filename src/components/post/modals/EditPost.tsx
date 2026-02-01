'use client';

import { update } from "@/app/actions/post";

import { useActionState, useEffect, useState } from "react";
import { FocusTrap } from "focus-trap-react"

import { LoaderCircle } from "lucide-react";
import { UpdatePostState } from "@/lib/definitions";

type Props = {
    postId: string;
    postContent: string;
    authorId: string;
    onEdit: () => void;
    onClose: () => void;
};


const EditPost = (props: Props) => {
    const initialState: UpdatePostState = {
        ok: false,
        message: "",
        errors: {
            content: props.postContent
        }
    };

    const [error, setError] = useState<string>('');
    const [state, action, isPending] = useActionState<UpdatePostState, FormData>(update, initialState);

    useEffect(() => {
        if (state?.ok) props.onEdit();
    }, [state?.ok]);


    const handleCancel = () => {
        props.onClose();
    };

    return (
        <div className="modal">
            <FocusTrap>
                <form
                    className="modal-content flex flex-col gap-4"
                    action={action}>
                    <div className="flex flex-col ">
                        <h4 className="text-brand text-center font-semibold">Edit Post</h4>
                        {/* <p>Are you sure you want to delete this post? This is an irreversible action.</p> */}
                        <input
                            name="id"
                            type="hidden"
                            value={props.postId}
                        />
                        <input
                            name="authorId"
                            type="hidden"
                            value={props.authorId}
                        />
                        <div>
                            <label htmlFor="content">Content:</label>
                            <textarea
                                name="content"
                                className="min-h-32 max-h-64"
                                placeholder="Lorem ipsum dolor..."
                                defaultValue={props.postContent}
                                minLength={1}
                                maxLength={400}
                                required
                            />
                        </div>
                        <p className="error">{error.length > 0 && error}</p>
                    </div>

                    <div className="flex flex-row justify-center gap-8">
                        <button
                            className="neutral"
                            onClick={handleCancel}
                            onKeyDown={(e) => e.key === 'Enter' && handleCancel()}>
                            Cancel
                        </button>

                        <button
                            className="primary"
                            type="submit"
                            disabled={isPending}>
                            { isPending ?
                                    <LoaderCircle className="icon animate-spin duration-200" />
                                : 'Confirm'
                            }
                        </button>
                    </div>
                </form>
            </FocusTrap>
        </div>
    );
};

export default EditPost;