import React from 'react';
import styled from 'styled-components';

export const InputWrapper = styled.div`
	box-shadow: 0 0 0 1px #e2e2e2;
	border-radius: 2px;
	box-sizing: border-box;
	padding: 4px 4px;
	cursor: pointer;
	display: flex;
	flex-direction: row;
	align-items: center;
	position: relative;
`;

export const InputLabel = styled.div`
	font-size: 14px;
	color: #323232;
	margin-bottom: 4px;
`;

export const ValueWrapper = styled.div`
	flex-grow: 1;
	flex-shrink: 1;
	font-size: 14px;
	line-height: 16px;
	padding: 4px 4px;
`;

export const CaretWrapper = styled.div`
	width: 16px;
	height: 16px;
	transition: transform 150ms ease;
	margin-right: 4px;

	svg {
		width: 100%;
		height: 100%;
		color: inherit;
	}

	&.active {
		transform: rotate(180deg);
	}
`;

export const CaretDown = () => { return (
	<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
		<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
			<path d="M18.706938,10.7084116 L12.5461852,16.8709287 L12.5461852,16.8709287 C12.4479271,16.9692149 12.334932,17.0183573 12.2071964,17.0183573 C12.0794609,17.0183573 11.9664658,16.9692149 11.8682077,16.8709287 L5.70745487,10.7084116 C5.31670557,10.3175505 5.31670557,9.68395793 5.70745487,9.29309673 C6.09805954,8.9023802 6.73144553,8.90228952 7.12216206,9.2928942 C7.12222958,9.2929617 7.1222971,9.29302921 7.1223646,9.29309673 L12.2071964,14.3793847 L12.2071964,14.3793847 L17.2920283,9.29309673 C17.682633,8.9023802 18.316019,8.90228952 18.7067355,9.2928942 C18.706803,9.2929617 18.7068705,9.29302921 18.706938,9.29309673 C19.0976873,9.68395793 19.0976873,10.3175505 18.706938,10.7084116 Z" fill="currentColor"></path>
		</g>
	</svg>
) };
