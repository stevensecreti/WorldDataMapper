import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import RegionPath						from '../navbar/RegionPath';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import Update 							from '../modals/Update';
import CreateAccount 					from '../modals/CreateAccount';
import NameMap							from '../modals/NameMap';
import NameLandmark						from '../modals/NameLandmark';
import Welcome 							from '../main/Welcome';
import MainContents						from '../main/MainContents';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { GET_DB_REGIONS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateRegionField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction,
	SortItems_Transaction,
	DeleteRegion_Transaction,
	AddRegion_Transaction} 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';
import { isObjectType } from 'graphql';


const Homescreen = (props) => {
	let maps 								= [];
	let regions 							= [];
	const [activeMap, setActiveMap] 		= useState({});
	const [activeRegion, setActiveRegion]	= useState({});
	const [renameId, setRenameId]			= useState('');
	const [deleteType, setDeleteType]		= useState(-1);
	const [deleteId, setDeleteId]			= useState('');
	const [landmarkIndex, setLMIndex]		= useState(-1);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate] 	= useState(false);
	const [showRename, toggleShowRename]	= useState(false);
	const [showDelete, toggleShowDelete]	= useState(false);
	const [showLM, toggleShowLM]			= useState(false);
	const [spreadSheet, toggleSpreadSheet]	= useState(true);

	const[AddMap]							= useMutation(mutations.ADD_MAP);
	const[DeleteMap]						= useMutation(mutations.DELETE_MAP);
	const[AddRegion]						= useMutation(mutations.ADD_REGION);
	const[AddSubregion]						= useMutation(mutations.ADD_SUBREGION);
	const[UpdateRegionField]				= useMutation(mutations.UPDATE_REGION_FIELD);
	const[DeleteRegion]						= useMutation(mutations.DELETE_REGION);
	const[DeleteSubregion]					= useMutation(mutations.DELETE_SUBREGION);
	const[PushSort]							= useMutation(mutations.PUSH_SORT);
	const[DeleteLandmark]					= useMutation(mutations.DELETE_LANDMARK);

	const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

	const regionQuery  = useQuery(GET_DB_REGIONS);
	if(regionQuery.loading) { console.log(regionQuery.loading, 'loading'); }
	if(regionQuery.error) 	{ console.log(regionQuery.error, 'error'); }
	if(regionQuery.data) {regions = regionQuery.data.getAllRegions; }

	const auth = props.user === null ? false : true;
	let displayName = "";
	if(auth){
		const firstName = props.user.firstName;
		const lastName = props.user.lastName;
		displayName = firstName + " " + lastName;
	}
	else{
		displayName = "";
	}

	const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
			if (activeMap._id) {
				let tempID = activeMap._id;
				let map = maps.find(map => map._id === tempID);
				setActiveMap(map);
			}
		}
	}

	const refetchRegions = async (refetch) => {
		const { loadingR, errorR, dataR } = await refetch();
		if (dataR) {
			regions = dataR.getAllRegions;
			if (activeRegion._id) {
				let tempID = activeRegion._id;
				let region = regions.find(region => region._id === tempID);
				setActiveRegion(region);
			}
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchMaps(refetch);
		refetchRegions(regionQuery.refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchMaps(refetch);
		refetchRegions(regionQuery.refetch);
		return retVal;
	}

	const tpsClear = async () =>{
		props.tps.clearAllTransactions();
	}

	useEffect(() => {
		document.addEventListener("keydown", keyCheck, false);
		return () => {
			document.removeEventListener("keydown", keyCheck, false);
		}
	});
	
	const keyCheck = async (event) => {
		if(event.key === "z" && event.ctrlKey){
		  tpsUndo();
		}
		if(event.key === "y" && event.ctrlKey){
		  tpsRedo();
		}
	}



	const handleCreateNewMap = async () =>{
		setRenameId("new");
		setShowRename();
	}

	const handleAddLandmark = async () =>{
		setLMIndex(-1);
		setShowLM();
	}

	const createNewMap = async (input) =>{
		const mapName = input;
		const length = maps.length
		const map_id = length >= 1 ? maps[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
		const mapList = {
			id: map_id,
			name: mapName,
			owner: props.user._id,
			regions: [],
		}
		const data = await AddMap({ variables: {map : mapList}, refetchQueries: [{ query: GET_DB_MAPS }] });
		await refetchMaps(refetch);
		window.location.reload(true);
	}

	const handleCreateNewRegion = async () =>{
		let map = false;
		let regionId = "";
		if(Object.keys(activeRegion).length===0){
			map = true;
			regionId = activeMap._id;
		}
		else{
			map = false;
			regionId = activeRegion._id;
		}
		const length = regions.length;
		const region_id = length >= 1 ? regions[length-1].id + Math.floor((Math.random() * 100) + 1) : 1;
		const regionList = {
			id: region_id,
			name: "Untitled",
			owner: props.user._id,
			subregions: [],
			leader: "Untitled",
			capital: "Untitled",
			flag: "Untitled",
			landmarks: [],
			parentRegion: regionId,
		}
		const { data } = await AddRegion({ variables: {region: regionList}, refetchQueries: [{ query: GET_DB_REGIONS }] });
		refetchMaps(refetch);
		refetchRegions(regionQuery.refetch);


		let transaction = new AddRegion_Transaction(regionId, region_id, map, AddSubregion, DeleteSubregion);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};



	const handleDeleteMap = async (_id) =>{
		setDeleteType(0);
		setShowDelete();
		setDeleteId(_id);
	}

	const deleteMap = async (_id) => {
		DeleteMap({ variables: {_id: _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
		refetch();
		setActiveMap({});
		setActiveRegion({});
	};

	const renameMap = async (_id) => {
		setRenameId(_id);
		setShowRename();
	}

	const handleSetActiveMap = (id) => {
		refetchRegions(regionQuery.refetch);
		const map = maps.find(map => map.id === id || map._id === id);
		setActiveMap(map);
	}

	const handleSetActiveRegion = (id) => {
		const region = regions.find(region => region.id === id || region._id === id);
		setActiveRegion(region);
	}

	const handleAncestorClick = (reg) => {
		if(reg._id === activeMap._id){
			setActiveRegion({});
		}
		else{
			setActiveRegion(reg);
		}
	}

	const handleRegionEdit = (_id, field, value, prevValue) =>{
		let transaction = new UpdateRegionField_Transaction(_id, field, value, prevValue, UpdateRegionField);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}


	const handleDeleteRegion = (_id) =>{
		setDeleteId(_id);
		setDeleteType(1);
		setShowDelete();
	}

	const deleteRegion = (_id) =>{
		let reg = regions.find(region => region._id === _id);
		const parentReg = reg.parentRegion;
		const regId = reg.id;
		let map = false;
		let index = -1;
		if(activeMap._id == parentReg){
			map = true;
			let length = activeMap.regions.length;
			for(let i = 0; i < length; i++){
				if(activeMap.regions[i] == regId){
					index = i;
				}
			}
		}
		else{
			let length = activeRegion.subregions.length;
			for(let i = 0; i < length; i++){
				if(activeRegion.subregions[i] == regId){
					index = i;
				}
			}
		}
		
		let transaction = new DeleteRegion_Transaction(parentReg, regId, map, index, DeleteSubregion);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const handleSort = (regs, col) =>{
		let map = false;
		let actReg = "";
		if(Object.keys(activeRegion).length===0){
			map = true;
			actReg = activeMap._id;
		}
		else{
			map = false;
			actReg = activeRegion._id;
		}
		let count = 0;
		let length = regs.length;
		let idsPrev = [];
		for(let i = 0; i < length; i++){
			idsPrev.push(regs[i].id);
		}
		if(col == 1){
			for(let i = 0; i < length; i++){
				for(let j = 0; j < length-1; j++){
					let name1 = regs[j].name;
					let name2 = regs[j+1].name;
					if(name1.localeCompare(name2) >= 0){
						let temp = regs[j];
						regs[j] = regs[j+1];
						regs[j+1] = temp;
						count = count + 1;
					}
				}
			}
		}
		else if(col == 2){
			for(let i = 0; i < length; i++){
				for(let j = 0; j < length-1; j++){
					let cap1 = regs[j].capital;
					let cap2 = regs[j+1].capital;
					if(cap1.localeCompare(cap2) >= 0){
						let temp = regs[j];
						regs[j] = regs[j+1];
						regs[j+1] = temp;
						count = count + 1;
					}
				}
			}
		}
		else if(col == 3){
			for(let i = 0; i < length; i++){
				for(let j = 0; j < length-1; j++){
					let leader1 = regs[j].leader;
					let leader2 = regs[j+1].leader;
					if(leader1.localeCompare(leader2) >= 0){
						let temp = regs[j];
						regs[j] = regs[j+1];
						regs[j+1] = temp;
						count = count + 1;
					}
				}
			}
		}
		if(count == 0){
			regs.reverse();
		}
		let ids = [];
		for(let i = 0; i < length; i++){
			ids.push(regs[i].id);
		}
		let transaction = new SortItems_Transaction(actReg, ids, idsPrev, map, PushSort);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const handleCloseMap = () => {
		setActiveMap({});
		setActiveRegion({});
	}

	const handleShowRegionViewer = () =>{
		toggleSpreadSheet(!spreadSheet);
	}

	const handleDeleteLandmark = (index) =>{
		let regId = activeRegion._id;
		let del = DeleteLandmark({ variables: {_id: regId, landmark: index}, refetchQueries: [{ query: GET_DB_REGIONS }] });
		refetchMaps(refetch);
		refetchRegions(regionQuery.refetch);
	}

	const handleRenameLandmark = (index) =>{
		setLMIndex(index);
		setShowLM();
	}

	const handleSibling = (direction) =>{
		let parentId = activeRegion.parentRegion;
		let regParent = regions.find(region => region._id === parentId);
		let siblings = [];
		if(regParent === undefined){
			regParent = maps.find(map => map._id === parentId);
			siblings = regParent.regions;
		}
		else{
			siblings = regParent.subregions;
		}
		let index = 0;
		for(let i = 0; i < siblings.length; i++){
			if(siblings[i] == activeRegion.id){
				index = i;
			}
		}
		index = index + direction;
		let newRegId = siblings[index];
		let newReg = regions.find(region => region.id === newRegId);
		setActiveRegion(newReg);
	}


	const handleRefetch = () =>{
		refetchMaps(refetch);
		refetchRegions(regionQuery.refetch);
	}

	const setShowLogin = () => {
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
		toggleShowUpdate(false);
		toggleShowRename(false);
		toggleShowLM(false);
		toggleShowDelete(false);
	};

	const setShowCreate = () => {
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
		toggleShowUpdate(false);
		toggleShowRename(false);
		toggleShowLM(false);
		toggleShowDelete(false);
	};

	const setShowUpdate = () => {
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowUpdate(!showUpdate);
		toggleShowRename(false);
		toggleShowLM(false);
		toggleShowDelete(false);
	};
	const setShowRename = () => {
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowUpdate(false);
		toggleShowRename(!showRename);
		toggleShowLM(false);
		toggleShowDelete(false);
	};
	const setShowLM = () => {
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowUpdate(false);
		toggleShowRename(false);
		toggleShowLM(!showLM);
		toggleShowDelete(false);
	};
	const setShowDelete = () =>{
		toggleShowDelete(!showDelete);
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowUpdate(false);
		toggleShowRename(false);
		toggleShowLM(false);
	}

	return(
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored" className="navbar">
					<ul>
						<WNavItem>
							<Logo className='logo' 
								closeActiveMap = {handleCloseMap}
							/>
						</WNavItem>
					</ul>
					<ul>
						<RegionPath
							activeMap = {activeMap} activeRegion = {activeRegion} 
							regions = {regions} maps = {maps} handleAncestorClick={handleAncestorClick}
							regionView = {spreadSheet} handleSibling = {handleSibling}
						/>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							setShowUpdate={setShowUpdate}
							setActiveMap={setActiveMap} displayName={displayName}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			<WLMain>
				{
					auth ?
					<MainContents
						activeMap = {activeMap} setActiveMap={handleSetActiveMap}
						maps = {maps} createNewMap = {handleCreateNewMap} deleteMap = {handleDeleteMap}
						renameMap = {renameMap} regions = {regions} activeRegion = {activeRegion}
						createNewRegion = {handleCreateNewRegion} setActiveRegion={handleSetActiveRegion}
						toggleRegionViewer={handleShowRegionViewer} spreadSheet={spreadSheet} editRegion = {handleRegionEdit}
						deleteRegion = {handleDeleteRegion} handleSort = {handleSort} handleAddLandmark = {handleAddLandmark}
						deleteLM = {handleDeleteLandmark} renameLM = {handleRenameLandmark}
					/>
					:
					<Welcome/>
				}
			</WLMain>
			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchTodos={refetch}setShowLogin={setShowLogin} />)
			}

			{
				showUpdate && (<Update fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} userId={props.user._id} user = {props.user}/>)
			}
			{
				showRename && (<NameMap setShowRename={setShowRename} renameId={renameId} setActiveMap = {setActiveMap} refetch ={refetch} createNewMap = {createNewMap}/>)
			}
			{
				showLM && (<NameLandmark setShowLM = {setShowLM} _id = {activeRegion._id} handleRefetch = {handleRefetch} index = {landmarkIndex}/>)
			}
			{
				showDelete && (<Delete setShowDelete = {setShowDelete} deleteMap = {deleteMap} type = {deleteType} deleteId = {deleteId} deleteRegion = {deleteRegion}/>)
			}

		</WLayout>
	);
	
};

export default Homescreen;