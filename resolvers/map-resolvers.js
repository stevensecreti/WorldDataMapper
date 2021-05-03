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
		}
	}
}