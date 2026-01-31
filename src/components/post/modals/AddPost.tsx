'use client';

import { create } from "@/app/actions/post";

import { useActionState, useState, useEffect } from "react";
import { FocusTrap } from "focus-trap-react";

import { Plus, X, LoaderCircle } from "lucide-react";
import { CreatePostState } from "@/lib/definitions";


type Props = {
    onCreate: () => void;
};

const initialState = {
    ok: false,
    message: "",
    errors: {
        content: ''
    }
};

const CreatePost = (props: Props) => {
    const [isModal, setIsModal] = useState<boolean>(false);
    const [state, action, isPending] = useActionState<CreatePostState, FormData>(create, initialState)

    useEffect(() => {
        if (state?.ok) {
            setIsModal(false);
            props.onCreate();
        };
    }, [state?.ok]);

    const handleClose = () => {
        setIsModal(false);
    };

    return (
        <>
            <button
                className="absolute right-4 bottom-4 rounded-full primary"
                onClick={() => setIsModal(true)}>
                <Plus />
            </button>

            { isModal &&
            <div className="modal">
                <FocusTrap>
                    <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 modal-content">
                        <h2>Create Post</h2>

                        <form action={action}>
                            <div>
                                <label htmlFor="content">Content:</label>
                                <textarea
                                    name="content"
                                    className="min-h-32 max-h-64"
                                    placeholder="Lorem ipsum dolor..."
                                    minLength={1}
                                    maxLength={400}
                                    required
                                />
                            </div>

                            <button
                                className="self-center primary"
                                type="submit"
                                disabled={isPending}>
                                { isPending ?
                                    <LoaderCircle
                                        className="animate-spin duration-200"
                                    />
                                : 'Post'
                                }
                            </button>
                        </form>

                        <button
                            className="danger modal-close"
                            onClick={handleClose}>
                            <X />
                        </button>
                    </div>
                </FocusTrap>
            </div>
            }
        </>
    );
};

export default CreatePost;