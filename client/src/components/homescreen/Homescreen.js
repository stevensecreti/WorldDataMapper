import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import RegionPath						from '../navbar/RegionPath';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import Update 							from '../modals/Update';
import CreateAccount 					from '../modals/CreateAccount';
import NameMap							from '../modals/NameMap';
import Welcome 							from '../main/Welcome';
import MainContents						from '../main/MainContents';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { GET_DB_REGIONS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction,
	SortItems_Transaction} 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';
import { isObjectType } from 'graphql';


const Homescreen = (props) => {
	let maps 								= [];
	let regions 							= [];
	const [activeMap, setActiveMap] 		= useState({});
	const [activeRegion, setActiveRegion]	= useState({});
	const [renameId, setRenameId]			= useState('');
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate] 	= useState(false);
	const [showRename, toggleShowRename]	= useState(false);
	const [spreadSheet, toggleSpreadSheet]	= useState(true);

	const[AddMap]							= useMutation(mutations.ADD_MAP);
	const[DeleteMap]						= useMutation(mutations.DELETE_MAP);
	const[AddRegion]						= useMutation(mutations.ADD_REGION);
	const[AddSubregion]						= useMutation(mutations.ADD_SUBREGION);

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


	const handleCreateNewMap = async () =>{
		setRenameId("new");
		setShowRename();
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
		const{ added } = await AddSubregion({ variables: {_id: regionId, region: region_id, map: map}, refetchQueries: [{ query: GET_DB_MAPS }] });	
	 	await refetchMaps(refetch);
		await refetchRegions(regionQuery.refetch);
	};

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

	const handleCloseMap = () => {
		setActiveMap({});
		setActiveRegion({});
	}

	const handleShowRegionViewer = () =>{
		toggleSpreadSheet(!spreadSheet);
	}

	const setShowLogin = () => {
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
		toggleShowUpdate(false);
		toggleShowRename(false);
	};

	const setShowCreate = () => {
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
		toggleShowUpdate(false);
		toggleShowRename(false);
	};

	const setShowUpdate = () => {
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowUpdate(!showUpdate);
		toggleShowRename(false);
	};
	const setShowRename = () => {
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowUpdate(false);
		toggleShowRename(!showRename);
	};

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
							regions = {regions} handleAncestorClick={handleAncestorClick}
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
						maps = {maps} createNewMap = {handleCreateNewMap} deleteMap = {deleteMap}
						renameMap = {renameMap} regions = {regions} activeRegion = {activeRegion}
						createNewRegion = {handleCreateNewRegion} setActiveRegion={handleSetActiveRegion}
						toggleRegionViewer={handleShowRegionViewer} spreadSheet={spreadSheet}
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

		</WLayout>
	);
	
};

export default Homescreen;