const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const Region = require('../models/region-model');

module.exports = {
    Query: {
        getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);
		},
        getAllRegions: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const regions = await Region.find({owner: _id});
			if(regions) return (regions);
		},
        getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if((map)) return map;
			else return ({});
		},
        getRegionById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const region = await Region.findOne({_id: objectId});
			if((region)) return region;
			else return ({});
		}
    },
	Mutation: {
		addMap: async (_, args) =>{
			const { map } = args;
			const objectId = new ObjectId();
			const { id, name, owner, regions } = map;
			const newMap = new Map({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
				regions: regions
			});
			const updated = newMap.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},
		deleteMap: async (_, args) => {	
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},
		renameMap: async (_, args) => {
			const { _id, name } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {name: name});
			if(updated) return true;
			else return false;
		},
		addRegion: async (_, args) =>{
			const { region } = args;
			const objectId = new ObjectId();
			const { id, name, owner, subregions, leader, capital, flag, landmarks, parentRegion } = region;
			const newRegion = new Region({
					_id: objectId,
					id: id,
					name: name,
					owner: owner,
					subregions: subregions,
					leader: leader,
					capital: capital,
					flag: flag,
					landmarks: landmarks,
					parentRegion: parentRegion
			});
			const updated = newRegion.save();
			if(updated) return objectId;
			else return ('Could not add region');
		},
		addSubregion: async (_, args) =>{
			const { _id, region, map } = args;
			const objectId = new ObjectId(_id);
			
			if(map){
				const found = await Map.findOne({_id: objectId});
				let subregions = found.regions;
				subregions.push(region);
				const updated = await Map.updateOne({_id: objectId}, {regions: subregions});
				if(updated) return true;
				else return false;
			}
			else{
				const found = await Region.findOne({_id: objectId});
				let subregions = found.subregions;
				subregions.push(region);
				const updated = await Region.updateOne({_id: objectId}, {subregions: subregions});
				if(updated) return true;
				else return false;
			}	
		},
		updateRegionField: async (_, args) =>{
			const { _id, field, value } = args;
			const objId = new ObjectId(_id);
			if(field == 1){
				const updated = await Region.updateOne({_id: objId}, {name: value});
				if(updated) return true;
				else return false;
			}
			else if(field == 2){
				const updated = await Region.updateOne({_id: objId}, {capital: value});
				if(updated) return true;
				else return false;
			}
			else if(field == 3){
				const updated = await Region.updateOne({_id: objId}, {leader: value});
				if(updated) return true;
				else return false;
			}
		},
		deleteRegion: async (_, args) =>{
			const { _id } = args;
			const objId = new ObjectId(_id);
			const del = await Region.deleteOne({_id: _id});
			if(del) return true;
			else return false;
		},
		deleteSubregion: async (_, args) =>{
			console.log(args);
			const { _id, id, map, index } = args;
			const objId = new ObjectId(_id);
			if(map){
				const parent = await Map.findOne({_id: objId});
				let regs = parent.regions;
				if(index == -1){
					regs = regs.filter(reg => reg != id);
					const updated = await Map.updateOne({_id: objId}, {regions: regs});
					if(updated) return true;
					else return false;
				}
				else{
					regs.splice(index, 0, id);
					const updated = await Map.updateOne({_id: objId}, {regions: regs});
					if(updated) return true;
					else return false;
				}	
			}
			else{
				const parent = await Region.findOne({_id: objId});
				let regs = parent.subregions;
				if(index == -1){
					console.log(regs);
					regs = regs.filter(reg => reg != id);
					console.log(regs);
					const updated = await Region.updateOne({_id: objId}, {subregions: regs});
					console.log(updated);
					if(updated) return true;
					else return false;
				}
				else{
					regs.splice(index, 0, id);
					const updated = await Region.updateOne({_id: objId}, {subregions: regs});
					if(updated) return true;
					else return false;
				}
			}
		},
		pushSort: async (_, args) =>{
			const { _id, ids, map } = args;
			const objId = new ObjectId(_id);
			if(map){
				const updated = await Map.updateOne({_id: _id}, {regions: ids});
				if(updated) return true;
				else return false;
			}
			else{
				const updated = await Region.updateOne({_id: _id}, {subregions: ids});
				if(updated) return true;
				else return false;
			}
		},
		addLandmark: async (_, args) =>{
			const { _id, landmark, code } = args;
			if(code == 0){
				const objId = new ObjectId(_id);
				const found = await Region.findOne({_id: objId});
				landmarks = found.landmarks;
				landmarks.push(landmark);
				const updated = await Region.updateOne({_id: objId}, {landmarks: landmarks});
				if(updated) return true;
				else return false;
			}
			else{
				const objId = new ObjectId(_id);
				const found = await Region.findOne({_id: objId});
				landmarks = found.landmarks;
				landmarks.pop();
				const updated = await Region.updateOne({_id: objId}, {landmarks: landmarks});
				if(updated) return true;
				else return false;
			}

		},
		deleteLandmark: async (_, args) =>{
			const { _id, landmark, name, code } = args;
			if(code == 0){
				const objId = new ObjectId(_id);
				const found = await Region.findOne({_id: objId});
				landmarks = found.landmarks;
				landmarks.splice(landmark, 1);
				const updated = await Region.updateOne({_id: objId}, {landmarks: landmarks});
				if(updated) return true;
				else return false;
			}
			else{
				const objId = new ObjectId(_id);
				const found = await Region.findOne({_id: objId});
				landmarks = found.landmarks;
				landmarks.splice(landmark, 0, name);
				const updated = await Region.updateOne({_id: objId}, {landmarks: landmarks});
				if(updated) return true;
				else return false;
			}
		},
		renameLandmark: async (_, args) =>{
			const { _id, landmark, name } = args;
			const objId = new ObjectId(_id);
			const found = await Region.findOne({_id: objId});
			landmarks = found.landmarks;
			landmarks[landmark] = name;
			const updated = await Region.updateOne({_id: objId}, {landmarks: landmarks});
			if(updated) return true;
			else return false;
		},
		changeParent: async (_, args) =>{
			const { _id, new_parent } = args;
			const objId = new ObjectId(_id);
			const updated = await Region.updateOne({_id: objId}, {parentRegion: new_parent});
			if(updated) return true;
			else return false;
		}
	}
}