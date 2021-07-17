import React from 'react';
import { useHistory } from 'react-router-dom';

const Link: React.FC<{ href: string }> = ({ href, children }) => {
    const { push } = useHistory();
    const onClick = (e: Event) => {
        e.preventDefault();
        push(href);
    };
    return React.cloneElement(children as any, { onClick, href });
};

export default Link;
