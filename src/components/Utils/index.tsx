import
React, 
{ 
	useState,
	useEffect,
	FunctionComponent,
	RefObject,
	useRef
} from 'react';

export function useOnClickOutside(ref : RefObject<HTMLDivElement>, handler : (event? : Event) => void) {
	useEffect(
		() => {
			const listener : (event: Event) => void = function(event) {
				// Do nothing if clicking ref's element or descendent elements
				if (!ref.current || ref.current.contains(event.target as Node)) {
					return;
				}

				handler(event);
			};

			window.addEventListener('mousedown', listener);
			window.addEventListener('touchstart', listener);

			return () => {
				document.removeEventListener('mousedown', listener);
				document.removeEventListener('touchstart', listener);
			};
		},
		// Add ref and handler to effect dependencies
		// It's worth noting that because passed in handler is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap handler in useCallback before ...
		// ... passing it into this hook.
		[ref, handler]
	);
}

export function useReferredState<T>(initialValue: T = undefined): [T, React.MutableRefObject<T>, React.Dispatch<T>] {
	const [state, setState] = useState<T>(initialValue);
	const reference = useRef<T>(state);

	const setReferredState = (value : T) => {
			reference.current = value;
			setState(value);
	};

	return [state, reference, setReferredState];
};