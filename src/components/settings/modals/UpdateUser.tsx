import { update } from '@/app/actions/user';
import { capitalise } from '@/lib/helpers';
import Toast from '@/components/Toast';


import { useRef, useActionState, useState, useEffect } from "react";
import {FocusTrap} from 'focus-trap-react';
import { LoaderCircle, X } from "lucide-react";


type Props = {
    attr: string;
    show: boolean;
    onClose: () => void;
};

const initialState = {
    ok: false,
    message: "",
    errors: {
        username: '',
        email: '',
        password: ''
    }
};

const UpdateUserModal = (props: Props) => {
    const attrInput = useRef<HTMLInputElement>(null);
    const pwInput = useRef<HTMLInputElement>(null);
    const newPwInput = useRef<HTMLInputElement>(null);
    const [state, action, isPending] = useActionState(update, initialState);
    const [isToast, setIsToast] = useState<boolean>(false);

    console.log(state)

    useEffect(() => {
        if (state.ok) setIsToast(true);
    }, [state]);
    
    const handleClose = () => {
        state.ok = false;
        state.message = "";
        state.errors = {};
        setIsToast(false);

        if (attrInput.current) {
            attrInput.current.value = '';
        };
        if (pwInput.current) {
            pwInput.current.value = '';
        };
        if (newPwInput.current) {
            newPwInput.current.value = '';
        };

        props.onClose();
    };

    return (
        <div className="modal" hidden={!props.show}>
            <FocusTrap active={props.show}>
                <div>
                    <Toast
                        title='Success'
                        context='success'
                        content={`${capitalise(props.attr)} updated successfully.`}
                        visible={isToast}
                        onClose={() => setIsToast(false)}
                    />

                    <div className="modal-content">
                        <h2>{`Update ${capitalise(props.attr) || 'undefined'}`}</h2>

                        <form action={action}>
                            <input type="hidden" name='attr' value={props.attr} />

                            <div>
                                <label htmlFor="content">{`${capitalise(props.attr) || 'undefined'}:`}</label>
                                <input
                                    ref={attrInput}
                                    name={props.attr}
                                    type={props.attr === 'avatar' ? 'file' : props.attr || 'text'}
                                    accept={props.attr === 'avatar' ? 'image/png, image/jpg, image/jpeg, image/webp' : undefined}
                                    //? TODO: image/gif as premium option
                                    minLength={
                                        props.attr === 'username' ? 3
                                        : props.attr === 'password' ? 8
                                        : 1
                                    }
                                    placeholder={
                                        props.attr === 'username' ? 'John Smith'
                                        : props.attr === 'email' ? 'example@domain.com'
                                        : props.attr === 'password' ? '********'
                                        : props.attr === 'avatar' ? 'Choose file'
                                        : ''}
                                    required
                                />

                                { props.attr === 'email' && (
                                    <div>
                                        <label htmlFor="password">Password:</label>
                                        <input ref={pwInput} name="password" type="password" placeholder='********' required />
                                    </div>
                                )}

                                { props.attr === 'password' && (
                                    <>
                                        <div>
                                            <label htmlFor="new-password">New Password:</label>
                                            <input ref={newPwInput} name='new-password' type="password" placeholder='********' required />
                                        </div>

                                        <p className='error'>{state?.errors['new-password'] && state?.errors['new-password']}</p>
                                    </>
                                )}
                            </div>

                            <p className='error'>
                                {state?.errors[props.attr as keyof typeof state.errors] || state?.errors.password &&
                                String(state.errors[props.attr as keyof typeof state.errors] || state.errors.password)}
                            </p>

                            <button
                                className="primary"
                                type='submit'
                                disabled={isPending}>
                                { isPending ? ( 
                                    <LoaderCircle
                                        className="animate-spin duration-200"
                                    />
                                ) : (
                                    'Confirm'
                                )}
                            </button>
                        </form>

                        <button
                            className="danger modal-close"
                            onClick={handleClose}>
                            <X />
                        </button>
                    </div>
                </div>
            </FocusTrap>
        </div>
    );
};

export default UpdateUserModal;