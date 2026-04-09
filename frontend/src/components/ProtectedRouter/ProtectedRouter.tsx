import {toast} from "react-toastify";
import {Navigate} from "react-router-dom";
import React from "react";
import {useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../../features/users/store/usersSlice.ts";

interface Props extends React.PropsWithChildren {
    role?: string,
}

const ProtectedRouter: React.FC<Props> = ({role, children}) => {
    const user = useAppSelector(selectUser);

    if (!user) {
        toast.warning('You are not allowed to access this page. Please log in.');
        return  <Navigate to='/login'/>;
    }

    if (role && role !== user.role) {
        return  <Navigate to='/'/>;
    }

    return children;
};

export default ProtectedRouter;