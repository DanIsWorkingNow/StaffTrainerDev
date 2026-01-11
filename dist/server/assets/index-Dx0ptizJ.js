import { jsxs, jsx } from "react/jsx-runtime";
import { c as createServerFn, a as createServerRpc } from "../server.js";
import { useRouter } from "@tanstack/react-router";
import { g as getSupabaseServerClient } from "./supabase-CLvfjSRp.js";
import { useState } from "react";
import { i as Route } from "./router-B338aohD.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
import "@supabase/ssr";
import "@tanstack/react-router-devtools";
import "./seo-DlwJpbcL.js";
import "./rbac-C9pGKYGe.js";
import "redaxios";
const assignTrainer_createServerFn_handler = createServerRpc("59225030f70e54fd37c513636de9238a7b9d1cefd89c7c673f910f3c6e507824", (opts, signal) => {
  return assignTrainer.__executeServer(opts, signal);
});
const assignTrainer = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(assignTrainer_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("dormitory_assignments").insert({
    trainer_id: data.trainerId,
    room_id: data.roomId,
    check_in: (/* @__PURE__ */ new Date()).toISOString(),
    status: "active"
  });
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const removeTrainer_createServerFn_handler = createServerRpc("9eed1a3f7f261d3e01b9930bb3e5c7652207455ed8ee8cce7136d0e65a84d802", (opts, signal) => {
  return removeTrainer.__executeServer(opts, signal);
});
const removeTrainer = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(removeTrainer_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("dormitory_assignments").delete().eq("id", data.assignmentId);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
function generateAllBuildings() {
  const buildings = [];
  const buildingColors = {
    "ANGGERIK": "bg-purple-100 border-purple-300",
    "BOUGANVILLA": "bg-pink-100 border-pink-300",
    "RAFLESIA": "bg-red-100 border-red-300",
    "SEROJA": "bg-yellow-100 border-yellow-300",
    "LESTARI_4": "bg-green-100 border-green-300",
    "LESTARI_5": "bg-teal-100 border-teal-300",
    "LESTARI_6": "bg-cyan-100 border-cyan-300"
  };
  const standardDorms = ["ANGGERIK", "BOUGANVILLA", "RAFLESIA"];
  standardDorms.forEach((dormName) => {
    const floors = [];
    const groundFloorRooms = [];
    for (let i = 1; i <= 8; i++) {
      groundFloorRooms.push({
        id: `${dormName}-G-${i}`,
        roomNumber: i,
        capacity: 2,
        building: dormName,
        floor: 0,
        type: "standard"
      });
    }
    floors.push({
      floorNumber: 0,
      floorName: "Ground Floor",
      rooms: groundFloorRooms
    });
    for (let floor = 1; floor <= 3; floor++) {
      const floorRooms = [];
      for (let i = 1; i <= 24; i++) {
        floorRooms.push({
          id: `${dormName}-F${floor}-${i}`,
          roomNumber: i,
          capacity: 2,
          building: dormName,
          floor,
          type: "standard"
        });
      }
      floors.push({
        floorNumber: floor,
        floorName: `Floor ${floor}`,
        rooms: floorRooms
      });
    }
    buildings.push({
      name: dormName,
      type: "standard",
      displayName: dormName,
      color: buildingColors[dormName],
      floors
    });
  });
  const serojaFloors = [];
  const serojaGroundRooms = [];
  for (let i = 1; i <= 8; i++) {
    serojaGroundRooms.push({
      id: `SEROJA-G-${i}`,
      roomNumber: i,
      capacity: 2,
      building: "SEROJA",
      floor: 0,
      type: "standard"
    });
  }
  serojaFloors.push({
    floorNumber: 0,
    floorName: "Ground Floor",
    rooms: serojaGroundRooms
  });
  const serojaVIPRooms = [];
  for (let i = 1; i <= 24; i++) {
    serojaVIPRooms.push({
      id: `SEROJA-F1-${i}`,
      roomNumber: i,
      capacity: 1,
      // VIP - 1 person only
      building: "SEROJA",
      floor: 1,
      type: "vip"
    });
  }
  serojaFloors.push({
    floorNumber: 1,
    floorName: "Floor 1 (VIP)",
    rooms: serojaVIPRooms
  });
  for (let floor = 2; floor <= 3; floor++) {
    const floorRooms = [];
    for (let i = 1; i <= 24; i++) {
      floorRooms.push({
        id: `SEROJA-F${floor}-${i}`,
        roomNumber: i,
        capacity: 2,
        building: "SEROJA",
        floor,
        type: "standard"
      });
    }
    serojaFloors.push({
      floorNumber: floor,
      floorName: `Floor ${floor}`,
      rooms: floorRooms
    });
  }
  buildings.push({
    name: "SEROJA",
    type: "vip",
    displayName: "SEROJA (VIP)",
    color: buildingColors["SEROJA"],
    floors: serojaFloors
  });
  const lestariBuildings = ["LESTARI_4", "LESTARI_5", "LESTARI_6"];
  lestariBuildings.forEach((lestariName, index) => {
    const floors = [];
    const houses = [];
    for (let i = 1; i <= 15; i++) {
      houses.push({
        id: `${lestariName}-H${i}`,
        roomNumber: i,
        capacity: 8,
        building: lestariName,
        floor: 0,
        // Quarters are single-story houses
        type: "quarters"
      });
    }
    floors.push({
      floorNumber: 0,
      floorName: "Houses",
      rooms: houses
    });
    buildings.push({
      name: lestariName,
      type: "quarters",
      displayName: `LESTARI ${index + 4}`,
      color: buildingColors[lestariName],
      floors
    });
  });
  return buildings;
}
function DormitoryPage() {
  const router = useRouter();
  const {
    assignments,
    trainers,
    stats
  } = Route.useLoaderData();
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const roomAssignments = assignments.reduce((acc, assignment) => {
    const roomId = assignment.room_id;
    if (!acc[roomId]) {
      acc[roomId] = [];
    }
    acc[roomId].push(assignment);
    return acc;
  }, {});
  const allBuildings = generateAllBuildings();
  const selectedBuildingData = selectedBuilding === "" ? null : allBuildings.find((b) => b.name === selectedBuilding);
  const availableFloors = selectedBuildingData ? selectedBuildingData.floors : [];
  const getAllRooms = () => {
    const rooms = [];
    allBuildings.forEach((building) => {
      building.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          rooms.push({
            ...room,
            buildingDisplayName: building.displayName,
            buildingColor: building.color,
            floorName: floor.floorName,
            assignments: roomAssignments[room.id] || []
          });
        });
      });
    });
    return rooms;
  };
  const allRooms = getAllRooms();
  const filteredRooms = selectedBuilding === "" ? [] : allRooms.filter((room) => {
    const matchesBuilding = room.building === selectedBuilding;
    const matchesFloor = selectedFloor === "all" || room.floor === selectedFloor;
    if (!matchesBuilding || !matchesFloor) return false;
    if (searchTerm) {
      return room.assignments.some((a) => a.trainer?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return true;
  });
  const unassignedTrainers = trainers.filter((trainer) => !assignments.some((a) => a.trainer?.id === trainer.id));
  const handleAssign = async () => {
    if (!selectedTrainer || !selectedRoom) {
      alert("Please select both a trainer and a room");
      return;
    }
    setIsAssigning(true);
    try {
      await assignTrainer({
        data: {
          trainerId: parseInt(selectedTrainer),
          roomId: selectedRoom
        }
      });
      setSelectedTrainer("");
      setSelectedRoom("");
      await router.invalidate();
    } catch (error) {
      alert("Failed to assign trainer: " + error.message);
    } finally {
      setIsAssigning(false);
    }
  };
  const handleRemove = async (assignmentId) => {
    if (!confirm("Are you sure you want to remove this trainer from the room?")) {
      return;
    }
    setIsRemoving(true);
    try {
      await removeTrainer({
        data: {
          assignmentId
        }
      });
      await router.invalidate();
    } catch (error) {
      alert("Failed to remove trainer: " + error.message);
    } finally {
      setIsRemoving(false);
    }
  };
  const handleBuildingChange = (building) => {
    setSelectedBuilding(building);
    setSelectedFloor("all");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Dormitory Management" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Select a building below to view and manage room assignments" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { title: "Total Rooms", value: stats.totalRooms, icon: "🏢", color: "bg-blue-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Occupied Rooms", value: stats.occupiedRooms, icon: "🔒", color: "bg-green-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Available Rooms", value: stats.availableRooms, icon: "🔓", color: "bg-yellow-500" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Occupancy Rate", value: `${stats.occupancyRate}%`, icon: "📊", color: "bg-purple-500" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Select a Building" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4 text-sm", children: "Click on any building below to view its room layout" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4", children: allBuildings.map((building) => {
        const buildingRooms = allRooms.filter((r) => r.building === building.name);
        const totalCapacity = buildingRooms.reduce((sum, r) => sum + r.capacity, 0);
        const occupied = buildingRooms.reduce((sum, r) => sum + r.assignments.length, 0);
        const occupancyRate = Math.round(occupied / totalCapacity * 100);
        const isSelected = selectedBuilding === building.name;
        return /* @__PURE__ */ jsxs("div", { className: `${building.color} rounded-lg p-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all ${isSelected ? "ring-4 ring-blue-600 shadow-lg scale-105" : "hover:ring-2 hover:ring-blue-400"}`, onClick: () => handleBuildingChange(building.name), children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: building.displayName }),
            isSelected && /* @__PURE__ */ jsx("span", { className: "bg-blue-600 text-white text-xs px-2 py-1 rounded-full", children: "Selected" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
              building.type === "quarters" ? "Houses" : "Rooms",
              ": ",
              buildingRooms.length
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
              "Capacity: ",
              totalCapacity
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
              "Occupied: ",
              occupied
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all", style: {
                width: `${occupancyRate}%`
              } }) }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 mt-1", children: [
                occupancyRate,
                "% occupied"
              ] })
            ] })
          ] })
        ] }, building.name);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Assign Trainer to Dormitory" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Trainer" }),
          /* @__PURE__ */ jsxs("select", { value: selectedTrainer, onChange: (e) => setSelectedTrainer(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", disabled: isAssigning || isRemoving, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Trainer" }),
            unassignedTrainers.map((trainer) => /* @__PURE__ */ jsxs("option", { value: trainer.id, children: [
              trainer.name,
              " - ",
              trainer.rank
            ] }, trainer.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Room/House" }),
          /* @__PURE__ */ jsxs("select", { value: selectedRoom, onChange: (e) => setSelectedRoom(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", disabled: isAssigning || isRemoving, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Room" }),
            allRooms.filter((room) => room.assignments.length < room.capacity).map((room) => {
              const roomLabel = room.type === "quarters" ? `${room.buildingDisplayName} - House ${room.roomNumber}` : `${room.buildingDisplayName} - ${room.floorName} - Room ${room.roomNumber}`;
              return /* @__PURE__ */ jsxs("option", { value: room.id, children: [
                roomLabel,
                " (",
                room.assignments.length,
                "/",
                room.capacity,
                ")",
                room.type === "vip" ? " - VIP" : ""
              ] }, room.id);
            })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", { onClick: handleAssign, disabled: isAssigning || isRemoving || !selectedTrainer || !selectedRoom, className: "w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors", children: isAssigning ? "Assigning..." : "Assign" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "Filters" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsx("input", { type: "text", placeholder: selectedBuilding === "" ? "Select a building first..." : "Search by trainer name...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed", disabled: selectedBuilding === "" }),
        /* @__PURE__ */ jsxs("select", { value: selectedBuilding, onChange: (e) => handleBuildingChange(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select a Building First" }),
          /* @__PURE__ */ jsxs("optgroup", { label: "Standard Dormitories", children: [
            /* @__PURE__ */ jsx("option", { value: "ANGGERIK", children: "ANGGERIK" }),
            /* @__PURE__ */ jsx("option", { value: "BOUGANVILLA", children: "BOUGANVILLA" }),
            /* @__PURE__ */ jsx("option", { value: "RAFLESIA", children: "RAFLESIA" })
          ] }),
          /* @__PURE__ */ jsx("optgroup", { label: "VIP Dormitory", children: /* @__PURE__ */ jsx("option", { value: "SEROJA", children: "SEROJA (VIP)" }) }),
          /* @__PURE__ */ jsxs("optgroup", { label: "Quarters", children: [
            /* @__PURE__ */ jsx("option", { value: "LESTARI_4", children: "LESTARI 4" }),
            /* @__PURE__ */ jsx("option", { value: "LESTARI_5", children: "LESTARI 5" }),
            /* @__PURE__ */ jsx("option", { value: "LESTARI_6", children: "LESTARI 6" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("select", { value: selectedFloor, onChange: (e) => setSelectedFloor(e.target.value === "all" ? "all" : parseInt(e.target.value)), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed", disabled: selectedBuilding === "", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: selectedBuilding === "" ? "Select building first" : "All Floors" }),
          availableFloors.map((floor) => /* @__PURE__ */ jsx("option", { value: floor.floorNumber, children: floor.floorName }, floor.floorNumber))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: selectedBuilding !== "" ? `${selectedBuildingData?.displayName} - ${filteredRooms.length} ${selectedBuildingData?.type === "quarters" ? "houses" : "rooms"}` : "Room Layout - Please select a building" }),
      selectedBuilding === "" ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300", children: [
        /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "🏢" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-700 mb-2", children: "Select a Building to View Rooms" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Click on a building card above or use the dropdown filter to get started" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-2 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsx("span", { children: "📍" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Available: ",
            allBuildings.length,
            " buildings • ",
            allRooms.length,
            " rooms"
          ] })
        ] })
      ] }) : filteredRooms.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "🔍" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "No rooms found matching your filters" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: filteredRooms.map((room) => /* @__PURE__ */ jsx(RoomCard, { room, onRemove: handleRemove, isRemoving }, room.id)) })
    ] }),
    unassignedTrainers.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold mb-4", children: [
        "Unassigned Trainers (",
        unassignedTrainers.length,
        ")"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: unassignedTrainers.map((trainer) => /* @__PURE__ */ jsx("div", { className: "p-4 border border-yellow-300 bg-yellow-50 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: "⚠️" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: trainer.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: trainer.rank })
        ] })
      ] }) }, trainer.id)) })
    ] })
  ] });
}
function StatCard({
  title,
  value,
  icon,
  color
}) {
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-1", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold", children: value })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `${color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`, children: icon })
  ] }) });
}
function RoomCard({
  room,
  onRemove,
  isRemoving
}) {
  const {
    id,
    roomNumber,
    capacity,
    assignments,
    buildingDisplayName,
    buildingColor,
    floorName,
    type
  } = room;
  const currentOccupancy = assignments.length;
  const occupancyText = `${currentOccupancy}/${capacity}`;
  const slots = Array.from({
    length: capacity
  }, (_, index) => {
    const assignment = assignments[index];
    return {
      slotNumber: index + 1,
      assignment: assignment || null,
      trainer: assignment?.trainer || null,
      occupied: !!assignment
    };
  });
  let gridCols = "grid-cols-2";
  if (capacity === 1) gridCols = "grid-cols-1";
  if (capacity === 8) gridCols = "grid-cols-4";
  const roomLabel = type === "quarters" ? `House ${roomNumber}` : `Room ${roomNumber}`;
  return /* @__PURE__ */ jsxs("div", { className: `border-2 ${buildingColor} rounded-lg p-4 hover:shadow-md transition-shadow`, children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 border-b pb-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: buildingDisplayName }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700", children: [
        floorName,
        " - ",
        roomLabel
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
        occupancyText,
        " ",
        type === "vip" ? "(VIP)" : type === "quarters" ? "(Quarters)" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `grid ${gridCols} gap-2 mb-3`, children: slots.map((slot) => /* @__PURE__ */ jsx(OccupantSlot, { slotNumber: slot.slotNumber, trainer: slot.trainer, assignment: slot.assignment, occupied: slot.occupied, onRemove, isRemoving, isQuarters: type === "quarters" }, slot.slotNumber)) })
  ] });
}
function OccupantSlot({
  slotNumber,
  trainer,
  assignment,
  occupied,
  onRemove,
  isRemoving,
  isQuarters
}) {
  if (occupied && trainer && assignment) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-300 rounded p-2 min-h-[60px] flex flex-col items-center justify-center transition-colors hover:bg-red-200 relative group", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-800 text-center leading-tight break-words", children: trainer.name }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mt-1", children: trainer.rank }),
      /* @__PURE__ */ jsx("button", { onClick: () => onRemove(assignment.id), disabled: isRemoving, className: "absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed", title: "Remove trainer", children: "×" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded p-2 min-h-[60px] flex flex-col items-center justify-center transition-colors hover:bg-blue-100", children: [
    /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-2xl font-light", children: "—" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: isQuarters ? `Bed ${slotNumber}` : `Bed ${slotNumber}` })
  ] });
}
export {
  DormitoryPage as component
};
