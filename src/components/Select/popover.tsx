import React, { FunctionComponent, MouseEvent, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { SelectOptionType } from './index';
import { CSSTransition } from 'react-transition-group';
import _ from 'underscore';
import classNames from 'classnames';
import { useReferredState } from '../Utils/index';


const PopoverWrapper = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	min-width: 150px;
	z-index: 999;
	padding-top: 4px;

	&.transition-enter {
		opacity: 0;
		transform: translateY(-8px);
	}

	&.transition-enter-active {
		opacity: 1;
		transform: translateY(0);
		transition: opacity 0.15s ease, transform 0.15s ease;
	}

	&.transition-exit {
		opacity: 1;
		transform: translateY(0);
	}

	&.transition-exit-active {
		opacity: 0;
		transform: translateY(-8px);
		transition: opacity 0.15s ease, transform 0.15s ease;
	}
`;

const PopoverContainer = styled.div`
	box-shadow: 0 0 0 1px rgba(13, 35, 67, 0.06), 0 3.3px 10px -4px rgba(13, 35, 67, 0.4);
	border-radius: 2px;
	padding: 4px 0;
	font-size: 14px;
	color: #323232;
	background-color: white;
	overflow-x: hidden;
	overflow-y: auto;
	--webkit-overflow-scrolling: touch;
	max-height: ${32 * 5}px;
`;

const PopoverUL = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

const PopoverItem = styled.li`
	padding: 8px 8px;

	&.hover {
		background-color: #f2f2f2;
	}

	&.selected {
		background-color: #B3D4FF;
	}
`;

export type PopoverProps = {
	multi? : boolean,
	value : string | string[],
	options: SelectOptionType[] | [],
	show : boolean,

	searchPlaceholder? : string,
	emptySearch? : string,
	emptyOptions? : string,

	onChange? : ( newValue : string | string[], doClose? : boolean ) => void
}

function shiftCursorPosition(current : number, inc : number, length : number) {
	console.log(current, inc, length);
	if(current == -1 && inc != 0) {
		return (inc < 0 ? length - 1 : 0);
	} else if (current == 0 && inc < 0) {
		return length - 1;
	}
	return (current + inc) % length;
}

export const Popover : FunctionComponent<PopoverProps> = function(props : PopoverProps) {
	const [cursorPosition, cursorPositionRef, setCursorPosition] = useReferredState<number>(-1);
	const valueRef = useRef<string | string[] | null>(props.value);
	useEffect( () => { valueRef.current = props.value } , [props.value]);

	const listRef = useRef();

	function sendValue(newValue : string | string[] | null, forceClose? : boolean) {
		let doClose = forceClose || (!props.multi);
		let currentValue = valueRef.current;

		let result : string | string[] | null;

		if( !_.isNull(newValue) ) {
			if(props.multi) {
				// currentValue : array | null, newValue : string | null
				if ( (_.isArray(currentValue) || _.isNull(currentValue)) && (_.isString(newValue) || _.isNull(newValue)) ) {
	
					let newValueIndex = currentValue.indexOf(newValue);
					if (newValueIndex != -1) {
						result = _.without(currentValue, newValue);
					} else {
						result = _.union(currentValue, [newValue]);
					}
					
				// currentValue : array | null, newValue : array | null
				} else if ( (_.isArray(currentValue) || _.isNull(currentValue)) && (_.isArray(newValue) || _.isNull(newValue)) ) {
	
					result = _.union(currentValue, newValue);
	
				// currentValue is not array
				} else {
					throw `Value for multiselect should be null or string[]`;
				}

			} else {

				result = String(newValue);

			}
		}

		props.onChange && props.onChange(result || currentValue, doClose);
	}

	function changeCursorPosition(inc : number) {
		setCursorPosition( shiftCursorPosition(cursorPositionRef.current, inc, props.options.length) );
	}

	function onKeyNavigate(event : KeyboardEvent) : void {
		if(event.code == 'ArrowDown') {
			changeCursorPosition(1);
		}
		else if (event.code == 'ArrowUp') {
			changeCursorPosition(-1);
		} 
		else if (event.code == 'Escape') {
			sendValue(null, true);
		}
		else if (event.code == 'Enter' || event.code == 'Space') {
			sendValue(props.options[cursorPositionRef.current].value);
		}
	}

	useEffect( 
		() => {
			if(props.show) {
				window.addEventListener('keydown', onKeyNavigate);
			}
			return () => {
				console.log('key listener removed');
				window.removeEventListener('keydown', onKeyNavigate);
			}
		},
		[props.show, listRef]
	);

	function onItemClick(event : MouseEvent, val : string) {
		event.stopPropagation();
		sendValue(val);
	}

	function onItemHover(event: MouseEvent, index : number) {
		setCursorPosition(index);
	}

	function checkSelectedItem(itemValue : string, index : number) : string {
		let isSelected : boolean;
		if(props.multi) {
			isSelected = props.value.indexOf(itemValue) != -1;
		} else {
			isSelected = props.value == itemValue;
		}
		return classNames({
			'selected': isSelected,
			'hover': cursorPosition == index
		});
	}

	return (
		<CSSTransition unmountOnExit in={props.show} timeout={150} classNames="transition">
			<PopoverWrapper>
				<PopoverContainer>
					<PopoverUL>
					{
						(props.options as SelectOptionType[]).map( (item : SelectOptionType, index : number) =>
							<PopoverItem
								className={checkSelectedItem(item.value, index)}
								key={index.toString()}
								onClick={e => onItemClick(e, item.value)}
								onMouseEnter={e => onItemHover(e, index)}
							>
								{item.text}
							</PopoverItem>
						)
					}
					</PopoverUL>
				</PopoverContainer>
			</PopoverWrapper>
		</CSSTransition>
	);
}