import { useContext } from 'react';

import { UserContext } from '@/context/User';

const useUser = () => useContext(UserContext);

export default useUser;
