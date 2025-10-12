import { getSession } from '@/lib/session';
import Header from './Header';

const HeaderWrapper = async () => {
    const session = await getSession();

    return <Header session={session} />;
};

export default HeaderWrapper;