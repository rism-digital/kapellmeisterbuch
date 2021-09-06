import { useState, useEffect } from 'react';

/**
 * This is the useDidMount custom Hook, it provides a bool value that represents 
 * whether a component is mounted or not.
 * 
 * It is useful when we use useEffect Hook and we don't want it to call 
 * the effect function on the first render.
 */

export const useDidMount = () => {
    const [didMount, setDidMount] = useState(false);

    useEffect(() => setDidMount(true), []);

    return didMount;
};