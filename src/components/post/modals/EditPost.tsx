import { FocusTrap } from "focus-trap-react"

type Props = {
    show: boolean;
    onClose: () => void;
};

const EditPost = (props: Props) => {
    return (
        <div className="modal">
            <FocusTrap active={props.show}>

            </FocusTrap>
        </div>
    );
};

export default EditPost;