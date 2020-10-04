import React, { FunctionComponent, MouseEvent } from 'react';
import styled from 'styled-components';
import { SelectOptionType } from './index';
import { CSSTransition } from 'react-transition-group';
import _ from 'underscore';
import classNames from 'classnames';


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
`;

const PopoverUL = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

const PopoverItem = styled.li`
	padding: 8px 8px;

	&:hover {
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

	onChange? : ( newValue : string | string[] ) => void
}

export var Popover : FunctionComponent<PopoverProps> = function(props) {

	function onItemClick(event : MouseEvent, val : string) {
		let newValue : string | string[];
		if (props.multi) {
			event.stopPropagation();
			let valueIndex = props.value.indexOf(val);
			if (valueIndex != -1) {
				newValue = _.without(props.value, val);
			} else {
				newValue = _.union(props.value, [val]);
			}
		} else {
			newValue = val;
		}

		props.onChange && props.onChange(newValue);
	}

	function checkSelectedItem(itemValue : string) : string {
		let isSelected : boolean;
		if(props.multi) {
			isSelected = props.value.indexOf(itemValue) != -1;
		} else {
			isSelected = props.value == itemValue;
		}
		return classNames({
			'selected': isSelected
		});
	}

	return (
		<CSSTransition unmountOnExit in={props.show} timeout={150} classNames="transition">
			<PopoverWrapper>
				<PopoverContainer>
					<PopoverUL>
					{
						(props.options as SelectOptionType[]).map( (item : SelectOptionType, index : Number) =>
							<PopoverItem
								className={checkSelectedItem(item.value)}
								key={index.toString()}
								onClick={e => onItemClick(e, item.value)}
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