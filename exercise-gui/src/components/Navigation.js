import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const LogoutLink = () => {
    const { logout } = useAuth0();

    return <Link onClick={() => logout()}>Log Out</Link>;
};
  

export const Navigation = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/create-exercise">Create Exercise</Link>
                </li>
                    {isAuthenticated ? <li><LogoutLink /></li> : ''}
            </ul>
        </nav>
    );
}

export default Navigation;