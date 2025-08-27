// Source Code: https://github.com/BinBashBanana/webretro
// please dont use IE
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if (!window.fetch || !indexedDB) {
	alert("Update your browser!");
	throw "Update your browser!";
}

var fsBundleDirs, fsBundleFiles, loadStatus, romName, isPaused, wasmReady, bundleReady, biosReady, romMode, core, wIdb, romUploadCallback, latestVersion, mainCompleted, currentManager, romUploadsReady, realRomExt, currentTheme;
var bundleCdn = "https://cdn.jsdelivr.net/gh/BinBashBanana/webretro@master/";
var bundleCdnLatest = "https://cdn.jsdelivr.net/gh/BinBashBanana/webretro/";
var biosCdn = "https://cdn.jsdelivr.net/gh/archtaurus/RetroPieBIOS@master/BIOS/";
var relativeBase = (typeof relativeBase == "string") ? relativeBase : "";
var coreDir = "cores/";
var bioses = {
	"a5200": {
		path: "",
		files: ["5200.rom"]
	},
	"atari800": {
		path: "",
		files: ["5200.rom"]
	},
	"freechaf": {
		path: "",
		files: ["sl31253.bin", "sl31254.bin", "sl90025.bin"]
	},
	"freeintv": {
		path: "",
		files: ["exec.bin", "grom.bin"]
	},
	"gearcoleco": {
		path: "",
		files: ["colecovision.rom"]
	},
	"handy": {
		path: "",
		files: ["lynxboot.img"]
	},
	"mednafen_psx": {
		path: "",
		files: ["scph5500.bin", "scph5501.bin", "scph5502.bin"]
	},
	"mednafen_psx_hw": {
		path: "",
		files: ["scph5500.bin", "scph5501.bin", "scph5502.bin"]
	},
	"neocd": {
		path: "neocd/",
		files: ["neocd_z.rom"]
	},
	"o2em": {
		path: "",
		files: ["c52.bin", "g7400.bin", "jopac.bin", "o2rom.bin"]
	},
	"opera": {
		path: "",
		files: ["panafz10-norsa.bin", "panafz10ja-anvil-kanji.bin"]
	},
	"px68k": {
		path: "keropi/",
		files: ["cgrom.dat", "iplrom.dat", "iplrom30.dat", "iplromco.dat", "iplromxv.dat"]
	},
	"yabasanshiro": {
		path: "",
		files: ["saturn_bios.bin"]
	},
	"yabause": {
		path: "",
		files: ["saturn_bios.bin"]
	}
};
var defaultKeybinds = 'input_player1_start = "enter"\ninput_player1_select = "space"\ninput_player1_l = "e"\ninput_player1_l2 = "r"\ninput_player1_r = "p"\ninput_player1_r2 = "o"\ninput_player1_a = "h"\ninput_player1_b = "g"\ninput_player1_x = "y"\ninput_player1_y = "t"\ninput_player1_up = "up"\ninput_player1_left = "left"\ninput_player1_down = "down"\ninput_player1_right = "right"\ninput_player1_l_x_minus = "a"\ninput_player1_l_x_plus = "d"\ninput_player1_l_y_minus = "w"\ninput_player1_l_y_plus = "s"\ninput_player1_l3_btn = "x"\ninput_player1_r_x_minus = "j"\ninput_player1_r_x_plus = "l"\ninput_player1_r_y_minus = "i"\ninput_player1_r_y_plus = "k"\ninput_player1_r3_btn = "comma"\ninput_menu_toggle = "f1"\ninput_save_state = "f2"\ninput_load_state = "f3"\ninput_screenshot = "f4"\ninput_hold_fast_forward = "nul"\ninput_toggle_fast_forward = "nul"\ninput_hold_slowmotion = "nul"\ninput_toggle_slowmotion = "nul"\ninput_grab_mouse_toggle = "backslash"\ninput_game_focus_toggle = "tilde"\n';
var nulKeys = 'input_ai_service = "nul"\ninput_ai_service_axis = "nul"\ninput_ai_service_btn = "nul"\ninput_ai_service_mbtn = "nul"\ninput_audio_mute = "nul"\ninput_audio_mute_axis = "nul"\ninput_audio_mute_btn = "nul"\ninput_audio_mute_mbtn = "nul"\ninput_cheat_index_minus = "nul"\ninput_cheat_index_minus_axis = "nul"\ninput_cheat_index_minus_btn = "nul"\ninput_cheat_index_minus_mbtn = "nul"\ninput_cheat_index_plus = "nul"\ninput_cheat_index_plus_axis = "nul"\ninput_cheat_index_plus_btn = "nul"\ninput_cheat_index_plus_mbtn = "nul"\ninput_cheat_toggle = "nul"\ninput_cheat_toggle_axis = "nul"\ninput_cheat_toggle_btn = "nul"\ninput_cheat_toggle_mbtn = "nul"\ninput_desktop_menu_toggle = "nul"\ninput_desktop_menu_toggle_axis = "nul"\ninput_desktop_menu_toggle_btn = "nul"\ninput_desktop_menu_toggle_mbtn = "nul"\ninput_disk_eject_toggle = "nul"\ninput_disk_eject_toggle_axis = "nul"\ninput_disk_eject_toggle_btn = "nul"\ninput_disk_eject_toggle_mbtn = "nul"\ninput_disk_next = "nul"\ninput_disk_next_axis = "nul"\ninput_disk_next_btn = "nul"\ninput_disk_next_mbtn = "nul"\ninput_disk_prev = "nul"\ninput_disk_prev_axis = "nul"\ninput_disk_prev_btn = "nul"\ninput_disk_prev_mbtn = "nul"\ninput_duty_cycle = "nul"\ninput_enable_hotkey = "nul"\ninput_enable_hotkey_axis = "nul"\ninput_enable_hotkey_btn = "nul"\ninput_enable_hotkey_mbtn = "nul"\ninput_exit_emulator = "nul"\ninput_exit_emulator_axis = "nul"\ninput_exit_emulator_btn = "nul"\ninput_exit_emulator_mbtn = "nul"\ninput_fps_toggle = "nul"\ninput_fps_toggle_axis = "nul"\ninput_fps_toggle_btn = "nul"\ninput_fps_toggle_mbtn = "nul"\ninput_frame_advance = "nul"\ninput_frame_advance_axis = "nul"\ninput_frame_advance_btn = "nul"\ninput_frame_advance_mbtn = "nul"\ninput_game_focus_toggle_axis = "nul"\ninput_game_focus_toggle_btn = "nul"\ninput_game_focus_toggle_mbtn = "nul"\ninput_grab_mouse_toggle_axis = "nul"\ninput_grab_mouse_toggle_btn = "nul"\ninput_grab_mouse_toggle_mbtn = "nul"\ninput_hold_fast_forward_axis = "nul"\ninput_hold_fast_forward_btn = "nul"\ninput_hold_fast_forward_mbtn = "nul"\ninput_slowmotion = "nul"\ninput_hold_slowmotion_axis = "nul"\ninput_hold_slowmotion_btn = "nul"\ninput_hold_slowmotion_mbtn = "nul"\ninput_hotkey_block_delay = "nul"\ninput_load_state_axis = "nul"\ninput_load_state_btn = "nul"\ninput_load_state_mbtn = "nul"\ninput_menu_toggle_axis = "nul"\ninput_menu_toggle_btn = "nul"\ninput_menu_toggle_mbtn = "nul"\ninput_movie_record_toggle = "nul"\ninput_movie_record_toggle_axis = "nul"\ninput_movie_record_toggle_btn = "nul"\ninput_movie_record_toggle_mbtn = "nul"\ninput_netplay_game_watch = "nul"\ninput_netplay_game_watch_axis = "nul"\ninput_netplay_game_watch_btn = "nul"\ninput_netplay_game_watch_mbtn = "nul"\ninput_netplay_host_toggle = "nul"\ninput_netplay_host_toggle_axis = "nul"\ninput_netplay_host_toggle_btn = "nul"\ninput_netplay_host_toggle_mbtn = "nul"\ninput_osk_toggle = "nul"\ninput_osk_toggle_axis = "nul"\ninput_osk_toggle_btn = "nul"\ninput_osk_toggle_mbtn = "nul"\ninput_overlay_next = "nul"\ninput_overlay_next_axis = "nul"\ninput_overlay_next_btn = "nul"\ninput_overlay_next_mbtn = "nul"\ninput_pause_toggle = "nul"\ninput_pause_toggle_axis = "nul"\ninput_pause_toggle_btn = "nul"\ninput_pause_toggle_mbtn = "nul"\ninput_player1_a_axis = "nul"\ninput_player1_a_btn = "nul"\ninput_player1_a_mbtn = "nul"\ninput_player1_b_axis = "nul"\ninput_player1_b_btn = "nul"\ninput_player1_b_mbtn = "nul"\ninput_player1_down_axis = "nul"\ninput_player1_down_btn = "nul"\ninput_player1_down_mbtn = "nul"\ninput_player1_gun_aux_a = "nul"\ninput_player1_gun_aux_a_axis = "nul"\ninput_player1_gun_aux_a_btn = "nul"\ninput_player1_gun_aux_a_mbtn = "nul"\ninput_player1_gun_aux_b = "nul"\ninput_player1_gun_aux_b_axis = "nul"\ninput_player1_gun_aux_b_btn = "nul"\ninput_player1_gun_aux_b_mbtn = "nul"\ninput_player1_gun_aux_c = "nul"\ninput_player1_gun_aux_c_axis = "nul"\ninput_player1_gun_aux_c_btn = "nul"\ninput_player1_gun_aux_c_mbtn = "nul"\ninput_player1_gun_dpad_down = "nul"\ninput_player1_gun_dpad_down_axis = "nul"\ninput_player1_gun_dpad_down_btn = "nul"\ninput_player1_gun_dpad_down_mbtn = "nul"\ninput_player1_gun_dpad_left = "nul"\ninput_player1_gun_dpad_left_axis = "nul"\ninput_player1_gun_dpad_left_btn = "nul"\ninput_player1_gun_dpad_left_mbtn = "nul"\ninput_player1_gun_dpad_right = "nul"\ninput_player1_gun_dpad_right_axis = "nul"\ninput_player1_gun_dpad_right_btn = "nul"\ninput_player1_gun_dpad_right_mbtn = "nul"\ninput_player1_gun_dpad_up = "nul"\ninput_player1_gun_dpad_up_axis = "nul"\ninput_player1_gun_dpad_up_btn = "nul"\ninput_player1_gun_dpad_up_mbtn = "nul"\ninput_player1_gun_offscreen_shot = "nul"\ninput_player1_gun_offscreen_shot_axis = "nul"\ninput_player1_gun_offscreen_shot_btn = "nul"\ninput_player1_gun_offscreen_shot_mbtn = "nul"\ninput_player1_gun_select = "nul"\ninput_player1_gun_select_axis = "nul"\ninput_player1_gun_select_btn = "nul"\ninput_player1_gun_select_mbtn = "nul"\ninput_player1_gun_start = "nul"\ninput_player1_gun_start_axis = "nul"\ninput_player1_gun_start_btn = "nul"\ninput_player1_gun_start_mbtn = "nul"\ninput_player1_gun_trigger = "nul"\ninput_player1_gun_trigger_axis = "nul"\ninput_player1_gun_trigger_btn = "nul"\ninput_player1_gun_trigger_mbtn = "nul"\ninput_player1_l2_axis = "nul"\ninput_player1_l2_btn = "nul"\ninput_player1_l2_mbtn = "nul"\ninput_player1_l3 = "nul"\ninput_player1_l3_axis = "nul"\ninput_player1_l3_mbtn = "nul"\ninput_player1_l_axis = "nul"\ninput_player1_l_btn = "nul"\ninput_player1_l_mbtn = "nul"\ninput_player1_l_x_minus_axis = "nul"\ninput_player1_l_x_minus_btn = "nul"\ninput_player1_l_x_minus_mbtn = "nul"\ninput_player1_l_x_plus_axis = "nul"\ninput_player1_l_x_plus_btn = "nul"\ninput_player1_l_x_plus_mbtn = "nul"\ninput_player1_l_y_minus_axis = "nul"\ninput_player1_l_y_minus_btn = "nul"\ninput_player1_l_y_minus_mbtn = "nul"\ninput_player1_l_y_plus_axis = "nul"\ninput_player1_l_y_plus_btn = "nul"\ninput_player1_l_y_plus_mbtn = "nul"\ninput_player1_left_axis = "nul"\ninput_player1_left_mbtn = "nul"\ninput_player1_r2_axis = "nul"\ninput_player1_r2_btn = "nul"\ninput_player1_r2_mbtn = "nul"\ninput_player1_r3 = "nul"\ninput_player1_r3_axis = "nul"\ninput_player1_r3_mbtn = "nul"\ninput_player1_r_axis = "nul"\ninput_player1_r_btn = "nul"\ninput_player1_r_mbtn = "nul"\ninput_player1_r_x_minus_axis = "nul"\ninput_player1_r_x_minus_btn = "nul"\ninput_player1_r_x_minus_mbtn = "nul"\ninput_player1_r_x_plus_axis = "nul"\ninput_player1_r_x_plus_btn = "nul"\ninput_player1_r_x_plus_mbtn = "nul"\ninput_player1_r_y_minus_axis = "nul"\ninput_player1_r_y_minus_btn = "nul"\ninput_player1_r_y_minus_mbtn = "nul"\ninput_player1_r_y_plus_axis = "nul"\ninput_player1_r_y_plus_btn = "nul"\ninput_player1_r_y_plus_mbtn = "nul"\ninput_player1_right_axis = "nul"\ninput_player1_right_mbtn = "nul"\ninput_player1_select_axis = "nul"\ninput_player1_select_btn = "nul"\ninput_player1_select_mbtn = "nul"\ninput_player1_start_axis = "nul"\ninput_player1_start_btn = "nul"\ninput_player1_start_mbtn = "nul"\ninput_player1_turbo = "nul"\ninput_player1_turbo_axis = "nul"\ninput_player1_turbo_btn = "nul"\ninput_player1_turbo_mbtn = "nul"\ninput_player1_up_axis = "nul"\ninput_player1_up_btn = "nul"\ninput_player1_up_mbtn = "nul"\ninput_player1_x_axis = "nul"\ninput_player1_x_btn = "nul"\ninput_player1_x_mbtn = "nul"\ninput_player1_y_axis = "nul"\ninput_player1_y_btn = "nul"\ninput_player1_y_mbtn = "nul"\ninput_poll_type_behavior = "nul"\ninput_recording_toggle = "nul"\ninput_recording_toggle_axis = "nul"\ninput_recording_toggle_btn = "nul"\ninput_recording_toggle_mbtn = "nul"\ninput_reset = "nul"\ninput_reset_axis = "nul"\ninput_reset_btn = "nul"\ninput_reset_mbtn = "nul"\ninput_rewind = "nul"\ninput_rewind_axis = "nul"\ninput_rewind_btn = "nul"\ninput_rewind_mbtn = "nul"\ninput_save_state_axis = "nul"\ninput_save_state_btn = "nul"\ninput_save_state_mbtn = "nul"\ninput_screenshot_axis = "nul"\ninput_screenshot_btn = "nul"\ninput_screenshot_mbtn = "nul"\ninput_send_debug_info = "nul"\ninput_send_debug_info_axis = "nul"\ninput_send_debug_info_btn = "nul"\ninput_send_debug_info_mbtn = "nul"\ninput_shader_next = "nul"\ninput_shader_next_axis = "nul"\ninput_shader_next_btn = "nul"\ninput_shader_next_mbtn = "nul"\ninput_shader_prev = "nul"\ninput_shader_prev_axis = "nul"\ninput_shader_prev_btn = "nul"\ninput_shader_prev_mbtn = "nul"\ninput_state_slot_decrease = "nul"\ninput_state_slot_decrease_axis = "nul"\ninput_state_slot_decrease_btn = "nul"\ninput_state_slot_decrease_mbtn = "nul"\ninput_state_slot_increase = "nul"\ninput_state_slot_increase_axis = "nul"\ninput_state_slot_increase_btn = "nul"\ninput_state_slot_increase_mbtn = "nul"\ninput_streaming_toggle = "nul"\ninput_streaming_toggle_axis = "nul"\ninput_streaming_toggle_btn = "nul"\ninput_streaming_toggle_mbtn = "nul"\ninput_toggle_fast_forward_axis = "nul"\ninput_toggle_fast_forward_btn = "nul"\ninput_toggle_fast_forward_mbtn = "nul"\ninput_toggle_fullscreen = "nul"\ninput_toggle_fullscreen_axis = "nul"\ninput_toggle_fullscreen_btn = "nul"\ninput_toggle_fullscreen_mbtn = "nul"\ninput_toggle_slowmotion_axis = "nul"\ninput_toggle_slowmotion_btn = "nul"\ninput_toggle_slowmotion_mbtn = "nul"\ninput_turbo_default_button = "nul"\ninput_turbo_mode = "nul"\ninput_turbo_period = "nul"\ninput_volume_down = "nul"\ninput_volume_down_axis = "nul"\ninput_volume_down_btn = "nul"\ninput_volume_down_mbtn = "nul"\ninput_volume_up = "nul"\ninput_volume_up_axis = "nul"\ninput_volume_up_btn = "nul"\ninput_volume_up_mbtn = "nul"\n';
var extraConfig = 'rgui_show_start_screen = "false"\nnotification_show_remap_load = "false"\nmenu_mouse_enable = "true"\nmenu_pointer_enable = "true"\n';
var pdKeys = [8, 9, 13, 19, 27, 32, 33, 34, 35, 36, 42, 44, 45, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135];
var webretroVersion = 6.5;
var maxConsoleLength = 10000;
var versionIndicator = document.getElementById("versionindicator");
var webretroTitle = document.getElementById("webretrotitle");
var upload = document.getElementById("upload");
var startButton = document.getElementById("startbutton");
var smooth = document.getElementById("smooth");
var canvas = document.getElementById("canvas");
var canvasMask = document.getElementById("canvasmask");
var saveState = document.getElementById("savestate");
var loadState = document.getElementById("loadstate");
var undoSaveState = document.getElementById("undosavestate");
var undoLoadState = document.getElementById("undoloadstate");
var exportState = document.getElementById("exportstate");
var importState = document.getElementById("importstate");
var ffd = document.getElementById("ffd");
var ffdContent = document.getElementById("ffdcontent");
var coreSelectArea = document.getElementById("coreselectarea");
var uploadArea = document.getElementById("uploadarea");
var coreList = document.getElementById("corelist");
var systemName = document.getElementById("systemname");
var consoleButton = document.getElementById("consolebutton");
var resetButton = document.getElementById("resetbutton");
var resetButton2 = document.getElementById("resetbutton2");
var mouseGrabButton = document.getElementById("mousegrabbutton");
var gameFocusButton = document.getElementById("gamefocusbutton");
var fullscreenButton = document.getElementById("fullscreenbutton");
var menuButton = document.getElementById("menubutton");
var pauseButton = document.getElementById("pause");
var resumeOverlay = document.getElementById("resume");
var sideAlertHolder = document.getElementById("sidealertholder");
var saveGame = document.getElementById("savegame");
var exportSave = document.getElementById("exportsave");
var importSave = document.getElementById("importsave");
var autosave = document.getElementById("autosave");
var mainArea = document.getElementById("mainarea");
var menuBar = document.getElementById("menubar");
var menuHider = document.getElementById("menuhider");
var menuHeight = 45;
var actualMenuHeight = menuHeight;
var canvasCssWorkaroundElement = document.createElement("style");
var themeSelector = document.getElementById("themeselector");
var themes = {
	"iodinelight": {
		menuHeight: 45,
		id: ""
	},
	"iodinedark": {
		menuHeight: 45,
		id: "iodinedark"
	},
	"webplayer": {
		menuHeight: 65,
		id: "webplayer"
	},
	"webplayernavy": {
		menuHeight: 65,
		id: "webplayer navy"
	}
};
var defaultTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "iodinedark" : "iodinelight";
var loadingDiv = document.getElementById("loadingdiv");
var loadingText = document.getElementById("loadingtext");
var loadingBar = document.getElementById("loadingbar");
var takeScreenshot = document.getElementById("takescreenshot");
var modals = document.getElementById("modals");
var keybindTable = document.getElementById("keybindtable");
var saveKeybinds = document.getElementById("savekeybinds");
var resetKeybinds = document.getElementById("resetkeybinds");
var keybindsButton = document.getElementById("keybindsbutton");
var screenshotsButton = document.getElementById("screenshotsbutton");
var savesButton = document.getElementById("savesbutton");
var statesButton = document.getElementById("statesbutton");
var downloadAllScreenshots = document.getElementById("downloadallscreenshots");
var screenshotsDiv = document.getElementById("screenshotsdiv");
var saveTable = document.getElementById("savetable");
var romSelectorTable = document.getElementById("romselectortable");
var pso = document.getElementById("pso");
var coreOptions = {
	"melonds": {
		"leftright": 'melonds_screen_layout = "Left/Right"\n'
	},
	"mgba": {
		"lowpass": 'mgba_audio_low_pass_filter = "enabled"\n'
	},
	"mupen64plusNext": {
		"highres": 'mupen64plus-169screensize = "1280x720"\nmupen64plus-43screensize = "960x720"\n',
		"widescreen": 'mupen64plus-aspect = "16:9 adjusted"\n'
	},
	"snes9x": {
		"mouse": 'input_libretro_device_p1 = "2"\n'
	}
};
var managers = {};
managers.keybind = document.getElementById("keybindmanager");
managers.screenshot = document.getElementById("screenshotmanager");
managers.save = document.getElementById("savemanager");
managers.romSelector = document.getElementById("romselector");
var managerNames = {
	"save": "Saves & States",
	"romSelector": "Select the master ROM or playlist"
};
var managerTitle = document.getElementById("managertitle");
var managerClose = document.getElementById("managerclose");
var screenshotDatas = [];
var screenshotObjUrls = [];
var saveIDs = [];
var quotaText = document.getElementById("quotatext");
var recommendedExtensions = document.getElementById("recommendedextensions");
var systems = {
	"mgba": "GB/GBC/GBA",
	"nestopia": "NES",
	"mupen64plusNext": "Nintendo 64",
	"melonds": "Nintendo DS",
	"genesisPlusGx": "Sega Systems",
	"snes9x": "SNES"
};
var coreNames = {
	"mgba": "mGBA",
	"nestopia": "Nestopia UE",
	"mupen64plusNext": "Mupen64Plus-Next",
	"melonds": "melonDS",
	"genesisPlusGx": "Genesis Plus GX",
	"snes9x": "Snes9x"
};
var fileExts = {
	"GB/GBC/GBA": ".gb, .gbc, .gba",
	"GBA": ".gba",
	"GB/GBC": ".gb, .gbc",
	"Nintendo 64": ".n64, .v64, .z64, .u1, .ndd",
	"Nintendo DS": ".nds, .srl",
	"SNES": ".smc, .sfc, .swc, .fig, .bs",
	"Sega Systems": ".mdx, .md, .smd, .gen, .sms, .gg, .sg, .68k, .sgd",
	"Sega Genesis": ".mdx, .md, .smd, .gen, .sms, .68k, .sgd"
};
var multiFileCores = ["dosbox", 
	"dosbox_pure", "opera", "fsuae", "puae", 
	"cap32", "fbalpha2012", "fbneo", "mame2003_plus", 
	"vice_x64", "neocd", "mednafen_supergrafx", "mednafen_pce_fast", 
	"quasi88", "mednafen_pcfx", "mednafen_psx", "mednafen_psx_hw", 
	"scummvm", "flycast", "mednafen_saturn", "mednafen_saturn_hw", 
	"yabause", "yabasanshiro", "kronos", "px68k"
];
var exclusiveMultiFileCores = [
	"dosbox", "dosbox_pure", "fbalpha2012", "fbneo", "mame2003_plus", "scummvm"
]; // used for arcade systems, etc
var playlistExts = ".m3u, .cue, .ccd";
var playlistCores = ["opera", "fsuae", "puae", "cap32", "vice_x64", 
	"neocd", "mednafen_supergrafx", "mednafen_pce_fast", "quasi88", 
	"mednafen_pcfx", "mednafen_psx", "mednafen_psx_hw", "flycast", 
	"mednafen_saturn", "mednafen_saturn_hw", "yabause", "yabasanshiro", "kronos", "px68k"
]; // all of these must also be in multiFileCores
var cdromExts = ".iso, .img, .ciso, .cso, .chd";
var cdromCores = ["opera", "fsuae", "puae", "neocd", "dolphin", "mednafen_supergrafx", 
	"mednafen_pce_fast", "ppsspp", "pcsx2", "mednafen_psx", "mednafen_psx_hw", "mednafen_saturn", 
	"mednafen_saturn_hw", "yabause", "yabasanshiro", "kronos"]; // probably put these in playlistCores too
var multiSaveCores = ["pcsx2", "mednafen_psx", "mednafen_psx_hw", "scummvm", 
	"flycast", "mednafen_saturn", "mednafen_saturn_hw"
];
var noSaveCores = ["81", "dosbox", "dosbox_pure", "stella", "stella2014", "atari800", 
	"a5200", "prosystem", "handy", "mednafen_lynx", "hatari", "bk", "freechaf", "gw", 
	"freeintv", "bluemsx", "fmsx", "o2em", "np2kai", "px68k", "fuse"
];
var noStateCores = ["dosbox", "atari800", "virtualjaguar", "hatari", "bk", "gw", "bluemsx", "pcsx2", "scummvm", "px68k"];
var preferredCores = ["opera", "puae", "cap32", "fbneo", "stella2014", "a5200", 
	"prosystem", "virtualjaguar", "handy", "hatari", "gearcoleco", "vice_x64", "bk",
	 "freechaf", "mgba", "vba_next", "gw", "sameboy", "freeintv", "dosbox_pure", "fmsx", 
	 "nestopia", "neocd", "mednafen_ngp", "citra", "mupen64plusNext", "melonds", "dolphin", 
	 "o2em", "mednafen_pce_fast", "mednafen_supergrafx", "np2kai", "quasi88", "mednafen_pcfx", 
	 "ppsspp", "mednafen_psx_hw", "pcsx2", "snes9x", "scummvm", "flycast", "blastem", "kronos", 
	 "genesisPlusGx", "px68k", "81", "fuse", "theodore", "vecx", "mednafen_vb", "mednafen_wswan"
	];
var allCores = Object.keys(systems);
var allSystems = Object.keys(fileExts);
var allFileExts = Array.from(new Set(Object.values(fileExts).filter(i => i).join(", ").split(", "))).join(", ");
var systemsExperimentalFormat = Object.fromEntries(Object.values(systems).map(i => [i, allCores.filter(j => systems[j] == i)]));
var installedCores = ["genesisPlusGx", "melonds", "mgba", "mupen64plusNext", "nestopia", "snes9x"];
var installedSystems = allSystems.filter(i => installedCores.some(j => allCores.filter(k => systems[k] == i).includes(j)));
var installedFileExts = installedSystems.map(i => fileExts[i]).filter(i => i).join(", ");
var baseFsBundleDir = "/home/web_user/retroarch/bundle";
var baseFsSystemDir = "/home/web_user/retroarch/userdata/system/";
var baseFsConfigDir = "/home/web_user/retroarch/userdata/config/";
var baseFsSaveDir = "/home/web_user/retroarch/userdata/saves/";
var baseFsCheatsDir = "/home/web_user/retroarch/userdata/cheats/"
var FSTracking = new EventTarget();
var writeToFileCooldown = {};
var saveObj = {};
var bundleErrors = 0;
var sramExts = ".srm, .sram, .ram, .gam, .sav, .dsv, .nvr, .SNA, .mcr";
var smasBrickFix = {
	"16a160ddd431a3db6fcd7453ffae9c4c": [80, 65, 84, 67, 72, 0, 127, 160, 0, 8, 169, 1, 133, 160, 141, 0, 22, 107, 1, 191, 182, 0, 4, 34, 160, 255, 0, 6, 189, 164, 0, 4, 34, 160, 255, 0, 69, 79, 70],
	"e87d43969bdf563d1148e3b35e8b5360": [80, 65, 84, 67, 72, 0, 129, 160, 0, 8, 169, 1, 133, 160, 141, 0, 22, 107, 1, 193, 182, 0, 4, 34, 160, 255, 0, 6, 191, 164, 0, 4, 34, 160, 255, 0, 69, 79, 70],
	"2071b049a463cefd7a0b7aeab8037ca0": [80, 65, 84, 67, 72, 0, 127, 160, 0, 8, 169, 1, 133, 160, 141, 0, 22, 107, 1, 191, 190, 0, 4, 34, 160, 255, 0, 6, 189, 164, 0, 4, 34, 160, 255, 0, 69, 79, 70]
}; // Couldn't find SMAS+W SMC ROM [80,65,84,67,72,0,129,160,0,8,169,1,133,160,141,0,22,107,1,193,190,0,4,34,160,255,0,6,191,164,0,4,34,160,255,0,69,79,70]
// disable webcam for gameboy camera
var disableWebCam = true;
var appIsPwa = window.matchMedia("(display-mode: standalone)").matches;
// https://stackoverflow.com/a/11381730
var appIsPhone = false;
var appIsTouchscreen = false;
try {
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) appIsPhone = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) appIsTouchscreen = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
} catch (e) {
	console.warn(e);
}

// loads core name from url BTW
// query string into object
var queries = Object.fromEntries(window.location.search.substring(1).split("&").map(i => i.split("=")).map(i => i.map(i => i && decodeURIComponent(i))));

// new sort
function sortArray(array, sortTo) {
	
	const mapped = array.map((key, index) => ({
		key: key,
		label: sortTo[key]?.toLowerCase() || '', // fallback to empty string
		index: index
	}));
	mapped.sort((a, b) => {
		if (a.label < b.label) return -1;
		if (a.label > b.label) return 1;
		return a.index - b.index;
	});
	return mapped.map(item => item.key);
}

function updateCoreList() {
	var coreArr = sortArray(installedCores, systems);
	var aCoreList = '<li><a href="?core=autodetect">Autodetect</a></li>';
	for (var i = 0; i < coreArr.length; i++) {
		aCoreList += '<li><a href="?core=' + coreArr[i] + '">' + (coreNames[coreArr[i]] || coreArr[i]) + ' (' + systems[coreArr[i]] + ')</a></li>';
	}
	coreList.innerHTML = aCoreList;
}

function showCoreList() {
	updateCoreList();
	document.body.classList.add("coreselect");
	coreSelectArea.style.display = "flex";
	uploadArea.style.display = "none";
	ffd.style.display = "flex";
}

// back-forward cache fix. this was the only way that I found to do this. ULTRA STUPID!!!!!
window.addEventListener("load", function () {
	window.setTimeout(function () {
		updateCoreList();
	}, 0);
}, false);

// Binary to UTF-8
function u8atoutf8(data) {
	return new TextDecoder().decode(data);
}

function avShift(array, shift) {
	for (var i = 0; i < array.length; i++) {
		array[i] += shift;
	}
	return array;
}

// date time
function getTime() {
	var dateTime = new Date();
	return dateTime.getFullYear().toString() + "-" + (dateTime.getMonth() + 1).toString() + "-" + dateTime.getDate().toString() + "-" + dateTime.getHours().toString() + "-" + dateTime.getMinutes().toString();
}

// bytes to human-readable string
function bytesToHumanReadable(bytes, si) {
	bytes = bytes || 0;
	var extension = -1;
	while (bytes >= 1000) {
		bytes /= si ? 1000 : 1024;
		extension++;
	}
	return extension >= 8 ? "overflow" : bytes.toFixed(2) + " " + "KMGTPEZY".charAt(extension) + (!si && (extension > -1) ? "i" : "") + "B";
}

// js has no built-in capitalization function
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// key press stuff
function fakeKey(type, info) {
	var e = new KeyboardEvent(type, {
		code: info.code || undefined,
		key: info.key || undefined,
		shiftKey: info.shiftKey || undefined
	});
	document.dispatchEvent(e);
}

function fakeKeyPress(info) {
	fakeKey("keydown", info);
	window.setTimeout(function () {
		fakeKey("keyup", info);
	}, 50);
}

function fakeCharPress(key) {
	if (charToCodeMap.hasOwnProperty(key)) fakeKeyPress({
		code: charToCodeMap[key].code,
		key: charToKeyMap.hasOwnProperty(key) ? charToKeyMap[key].key : key,
		shiftKey: charToCodeMap[key].hasOwnProperty("shift") ? true : false
	});
}

function sendText(text) {
	for (var i = 0; i < text.length; i++) {
		fakeCharPress(text.charAt(i));
	}
}

function configIDToCode(configid) {
	return Object.keys(codeToConfigIDMap).find(k => codeToConfigIDMap[k] == configid);
}

function isAudioAllowed() {
	try {
		var audio = new AudioContext();
		var state = audio.state;
		audio.close();
		return (state == "running");
	} catch (e) {
		return false;
	}
}

// indexedDB
function setIdbItem(key, value, customTransaction) {
	(customTransaction || wIdb.transaction("main", "readwrite")).objectStore("main").put({
		key: key,
		value: value
	});
}

function getIdbItem(key, customTransaction) {
	return new Promise(function (resolve) {
		(customTransaction || wIdb.transaction("main", "readwrite")).objectStore("main").get(key).onsuccess = function (e) {
			resolve(e.target.result ? e.target.result.value : null);
		}
	});
}

function getAllIdbItems(customTransaction) {
	return new Promise(function (resolve) {
		(customTransaction || wIdb.transaction("main", "readwrite")).objectStore("main").getAll().onsuccess = function (e) {
			resolve(e.target.result ? e.target.result : null);
		}
	});
}

function removeIdbItem(key, customTransaction) {
	(customTransaction || wIdb.transaction("main", "readwrite")).objectStore("main").delete(key);
}

function openIdb() {
	var request = indexedDB.open("webretro", 2);
	request.onsuccess = function (e) {
		wIdb = e.target.result;
	}
	request.onupgradeneeded = function (e) {
		wIdb = e.target.result;
		var transaction = e.target.transaction;

		switch (e.oldVersion) {
			case 0:
				// create the object store
				wIdb.createObjectStore("main", {
					keyPath: "key"
				}).transaction.oncomplete = function () {
					// look for saves in localStorage from old versions
					var ls = Object.keys(localStorage);
					for (var i = 0; i < ls.length; i++) {
						if (ls[i].startsWith("RetroArch_saves_")) {
							setIdbItem(ls[i], [{
								ext: ".srm",
								dir: "",
								data: new Uint8Array(JSON.parse(localStorage.getItem(ls[i])))
							}], transaction);
							localStorage.removeItem(ls[i]);
						}
					}
				}
				break;
			case 1:
				// move the saves into arrays
				(async function () {
					var allItems = await getAllIdbItems(transaction);
					for (var i = 0; i < allItems.length; i++) {
						if (allItems[i].key.startsWith("RetroArch_saves_")) {
							setIdbItem(allItems[i].key, [{
								ext: ".srm",
								dir: "",
								data: allItems[i].value
							}], transaction);
						}
					}
				})();
				break;
		}
	}
}

openIdb();

// side alerts
function sideAlert(initialText, time) {
	var p = document.createElement("p");
	p.className = "sidealert";
	p.appendChild(document.createTextNode(initialText));
	sideAlertHolder.appendChild(p);
	window.setTimeout(function () {
		p.classList.add("on");
	}, 10);
	this.dismiss = function () {
		p.classList.remove("on");
		window.setTimeout(function () {
			p.remove();
		}, 100);
	}
	this.setText = function (text) {
		p.textContent = text;
	}
	if (time) window.setTimeout(this.dismiss, time);
}

// change background for status messages
function setStatus(message) {
	loadStatus = message;
	loadingText.textContent = message;
}

// remove status messages
function removeStatus(message) {
	if (loadStatus == message) setStatus("");
}

// adjust canvas size to window on window update
function adjustCanvasSize() {
	var dpi = window.devicePixelRatio || 1;
	var width = window.innerWidth * dpi;
	var height = (window.innerHeight * dpi)
	//  - (actualMenuHeight * dpi);
	if (Module && Module.setCanvasSize) {
		Module.setCanvasSize(width, height);
	} else {
		canvas.width = width;
		canvas.height = height;
	}
}
window.addEventListener("resize", adjustCanvasSize, false);
adjustCanvasSize();

// emscripten is stupid and removes css width and height properties from the canvas - https://github.com/emscripten-core/emscripten/issues/6353
function canvasCssWorkaround(css) {
	canvasCssWorkaroundElement.textContent = "#canvas { " + css + " }";
	document.head.appendChild(canvasCssWorkaroundElement);
}

// adjust the menu bar height
function adjustActualMenuHeight() {
	canvasCssWorkaround("top: " + actualMenuHeight + "px; height: calc(100vh - " + actualMenuHeight + "px);");
	canvasMask.style.top = "" + actualMenuHeight + "px";
	canvasMask.style.height = "calc(100vh - " + actualMenuHeight + "px)";

	menuBar.style.height = "" + actualMenuHeight + "px";

	adjustCanvasSize();
}

// menu hider
function adjustMenuHeight() {
	if (menuHider.checked) {
		actualMenuHeight = 0;
		adjustActualMenuHeight();
	} else {
		actualMenuHeight = menuHeight;
		adjustActualMenuHeight();
	}
}

// stop canvas change on menubar show/hide
// menuHider.onchange = adjustMenuHeight;

// logging
function log(log, userInput) {
	console.log(log);
	if (maxConsoleLength > 0 && wconsole.textContent.length > maxConsoleLength) wconsole.textContent = wconsole.textContent.substring(wconsole.textContent.indexOf("\n") + 1);
	wconsole.textContent += (userInput ? "> " + userInput + "\n\t" + JSON.stringify(log) : log) + "\n";
	wconsole.scrollTo({
		top: wconsole.scrollHeight
	});
}

// xhr
function grab(url, type, success, fail) {
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.overrideMimeType("text/plain; charset=x-user-defined");
	req.responseType = type;
	req.timeout = 8000;
	req.onload = function () {
		if (req.status >= 400) {
			if (fail) fail(req.status);
		} else {
			if (success) success(this.response);
		}
	}
	req.onerror = function () {
		if (fail) fail(0);
	}
	req.ontimeout = function () {
		if (fail) fail(0);
	}
	req.send();
}

// file readers
function readFile(file) {
	return new Promise(function (resolve) {
		var reader = new FileReader();
		reader.onload = function () {
			resolve(this.result);
		}
		reader.readAsArrayBuffer(file);
	});
}

function downloadFile(data, name, mime) {
	var a = document.createElement("a");
	a.download = name;
	a.href = URL.createObjectURL(new Blob([data], {
		type: mime || "application/octet-stream"
	}));
	a.click();
	window.setTimeout(function () {
		URL.revokeObjectURL(a.href);
	}, 2000);
}

function uploadFile(accept, callback) {
	var input = document.createElement("input");
	input.type = "file";
	input.accept = accept;
	input.onchange = async function () {
		var file = this.files[0];
		var data = await readFile(file);
		callback({
			name: file.name,
			data: data
		});
	}
	input.click();
}

function uploadFileMulti(accept, callback) {
	let directoryUpload = confirm("Upload a directory?");

	var input = document.createElement("input");
	input.type = "file";
	if (directoryUpload) {
		input.setAttribute("directory", "");
		input.setAttribute("webkitDirectory", "");
	} else {
		input.setAttribute("multiple", "");
		input.accept = accept;
	}
	input.onchange = async function () {
		let datas = [];
		for (var i = 0; i < this.files.length; i++) {
			var name = directoryUpload ? (this.files[i].relativePath || this.files[i].webkitRelativePath || "").split("/").slice(1).join("/") : this.files[i].name;
			var data = await readFile(this.files[i]);
			datas.push({
				path: name,
				data: data
			});
			if (i == this.files.length - 1 && callback) callback(datas);
		}
	}
	input.click();
}

// scripts
function getScript(url, callback, err) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	script.onload = function () {
		if (callback) callback();
	}
	script.onerror = function (e) {
		document.body.removeChild(script);
		if (err) err(e);
	}
	document.body.appendChild(script);
}

function getCore(name, callback, err) {
	getScript(relativeBase + coreDir + name + "Libretro.js", callback, err);
}

function getFileExtsForCore(core) {
	return [fileExts[systems[core]], (cdromCores.includes(core) ? cdromExts : ""), (playlistCores.includes(core) ? playlistExts : "")].filter(i => i).join(", ");
}

// unzip file
function unzipFile(data, exts, callback, empty, notfound) {
	new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(data))).getEntries().then(async function (entries) {
		if (entries.length) {
			for (var i = 0; i < entries.length; i++) {
				if (!entries[i].directory && exts.split(", ").includes("." + u8atoutf8(entries[i].rawFilename).split(".").slice(-1)[0].toLowerCase())) {
					var name = u8atoutf8(entries[i].rawFilename);
					var uzd = await entries[i].getData(new zip.Uint8ArrayWriter());
					callback(name, uzd.buffer);
					break;
				}
				if (i == entries.length - 1 && notfound) notfound();
			}
		} else if (empty) empty();
	});
}

// unzip all files
function unzipFileMulti(data, callback, empty) {
	new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(data))).getEntries().then(async function (entries) {
		if (entries.length) {
			let datas = [];
			for (var i = 0; i < entries.length; i++) {
				if (!entries[i].directory) {
					var name = u8atoutf8(entries[i].rawFilename);
					var uzd = await entries[i].getData(new zip.Uint8ArrayWriter());
					datas.push({
						path: name,
						data: uzd.buffer
					});
					if (i == entries.length - 1 && callback) callback(datas);
				}
			}
		} else if (empty) empty();
	});
}

// zip files
async function zipFiles(files, callback) {
	var u8aWriter = new zip.Uint8ArrayWriter("application/zip");
	var writer = new zip.ZipWriter(u8aWriter);
	for (var i = 0; i < files.length; i++) {
		await writer.add(files[i].path, new zip.Uint8ArrayReader(new Uint8Array(files[i].data)));
	}
	await writer.close();
	var zipped = await u8aWriter.getData();
	callback(zipped.buffer);
}

// file renames
function replaceInFiles(files, find, replace) {
	return files.map(i => ({
		path: i.path.replace(find, replace),
		data: i.data
	}));
}

// uauth uploads
function handleWebFile(data) {
	if (data.message == "success") {
		ffd.style.display = "none";
		romUploadCallback([{
			path: data.name,
			data: data.data
		}]);
	} else if (data.message == "error") {
		alert("There was an error with the file picker. This may mean that you have to allow popup windows.");
	}
}

function uploadWebFile(type, exts) {
	uauth.open(type, exts.split(", "), handleWebFile);
}

// file tree to list, etc (for drag-and-drop files)
function readFileEntry(fileEntry) {
	return new Promise(function (resolve) {
		fileEntry.file(function (file) {
			resolve(file);
		});
	});
}

function readDirectoryEntry(directoryEntry) {
	return new Promise(function (resolve) {
		directoryEntry.createReader().readEntries(function (entries) {
			resolve(entries);
		});
	});
}

async function fileTreeToList(items) {
	let newItems = [];
	for (var i = 0; i < items.length; i++) {
		if (items[i].isFile) {
			newItems.push(items[i]);
		} else if (items[i].isDirectory) {
			var entries = await readDirectoryEntry(items[i]);
			var contents = await fileTreeToList(entries);
			newItems = newItems.concat(contents);
		}
	}
	return newItems;
}

// rom upload
function readyRomUploads(exts) {
	romUploadsReady = true;

	// when a rom file is chosen
	upload.onclick = function () {
		if (multiFileCores.includes(core)) {
			uploadFileMulti(exts, function (files) {
				ffd.style.display = "none";
				log("Succesfully read ROM files...");
				romUploadCallback(files);
			});
		} else {
			uploadFile(exts, function (file) {
				ffd.style.display = "none";
				log('Succesfully read ROM file "' + file.name + '"');
				romUploadCallback([{
					path: file.name,
					data: file.data
				}]);
			});
		}
	}

	// file drop (we need these to be global so they can be removed later)
	window.fileDragEnter = function (e) {
		if (e.dataTransfer.types.includes("Files")) ffd.classList.add("filehover");
	}
	window.fileDragOver = function (e) {
		e.preventDefault();
	}
	window.fileDropped = async function (e) {
		if (e.dataTransfer.types.includes("Files")) {
			e.preventDefault();
			ffd.style.display = "none";

			let fileTree = Array.from(e.dataTransfer.items).map(i => i.webkitGetAsEntry());
			let files = await fileTreeToList(fileTree);
			let datas = [];

			for (var i = 0; i < files.length; i++) {
				var file = await readFileEntry(files[i]);
				var name = files[i].fullPath.slice(1);
				var data = await readFile(file);
				datas.push({
					path: name,
					data: data
				});
			}

			// extract inside if only 1 directory is dropped
			if (fileTree.length == 1 && fileTree[0].isDirectory) {
				for (var i = 0; i < datas.length; i++) {
					datas[i].path = datas[i].path.split("/").slice(1).join("/");
				}
			}

			log("Succesfully read ROM file(s)...");
			romUploadCallback(datas);
		}
	}
	document.addEventListener("dragenter", fileDragEnter, false);
	document.addEventListener("dragover", fileDragOver, false);
	document.addEventListener("drop", fileDropped, false);
}

// chrome 102 launch queue https://developer.chrome.com/blog/new-in-chrome-102/#file-handlers
function readyLaunchQueue() {
	if ("launchQueue" in window && LaunchParams && "files" in LaunchParams.prototype) {
		launchQueue.setConsumer(async function (params) {
			log("Launching with ROM file(s)...");
			ffd.style.display = "none";

			let datas = [];

			for (var i = 0; i < params.files.length; i++) {
				var file = await params.files[i].getFile();
				var data = await readFile(file);
				datas.push({
					path: params.files[i].name,
					data: data
				});
			}

			log("Succesfully read ROM file(s)...");
			romUploadCallback(datas);
		});
	}
}

// rom fetch
function readyRomFetch() {
	var romloc = (/^(https?:)?\/\//i).test(queries.rom) ? queries.rom : relativeBase + "roms/" + queries.rom;
	var romFilename = queries.rom.split("/").slice(-1)[0];
	grab(romloc, "arraybuffer", function (data) {
		log("Succesfully fetched ROM from " + romloc);
		romMode = "querystring";
		romUploadCallback([{
			path: romFilename,
			data: data
		}]);
	}, function (error) {
		alert("Could not get ROM at " + romloc + " (Error " + error + ")");
		romMode = "upload";
		ffd.style.display = "flex";
	});
}

// safe writeFile
function safeWriteFile(path, data) {
	FS.createPath("/", path.split("/").slice(1, -1).join("/"), true, true);
	return FS.writeFile(path, data);
}

function uploadNCreate() {
	uploadFile("", function (file) {
		FS.writeFile("/" + file.name, new Uint8Array(file.data));
	});
}

// console window
var conw = new jswindow({
	title: "Console",
	icon: "assets/terminal.svg"
});

var wconsole = document.createElement("textarea");
wconsole.classList.add("console");
wconsole.setAttribute("spellcheck", "false");
wconsole.setAttribute("readonly", "");

wconsole.wconsolemarker = document.createElement("span");
wconsole.wconsolemarker.classList.add("consolemarker");

wconsole.wconsoleinput = document.createElement("input");
wconsole.wconsoleinput.type = "text";
wconsole.wconsoleinput.classList.add("consoleinput");
wconsole.wconsoleinput.title = "You can type things here as though you were using the browser console.";
wconsole.wconsoleinput.setAttribute("spellcheck", "false");
wconsole.wconsolemarker.onclick = function () {
	wconsole.wconsoleinput.focus();
}
wconsole.wconsoleinput.onkeydown = async function (e) {
	e.stopPropagation();
	if (e.isTrusted && e.code == "Enter") {
		log(await eval("(async function() { return " + this.value + " })()"), this.value);
		this.value = "";
	}
}

conw.innerWindow.appendChild(wconsole);
conw.innerWindow.appendChild(wconsole.wconsolemarker);
conw.innerWindow.appendChild(wconsole.wconsoleinput);

consoleButton.onclick = function () {
	conw.open({
		width: 450,
		height: 250,
		left: 100,
		top: 50
	});
	wconsole.wconsoleinput.focus();
	wconsole.scrollTo({
		top: wconsole.scrollHeight
	});
}

if (queries.hasOwnProperty("console")) conw.open({
	width: 450,
	height: 250,
	left: 100,
	top: 50
});

// fullscreen button
fullscreenButton.onclick = function () {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		document.body.requestFullscreen();
	}
}

// theme selector
function setTheme(theme) {
	if (themes.hasOwnProperty(theme)) {
		document.body.dataset.theme = themes[theme].id;
		menuHeight = themes[theme].menuHeight;
		adjustMenuHeight();
	}
}

currentTheme = localStorage.getItem("webretro_settings_theme") || defaultTheme;
setTheme(currentTheme);
try {
	themeSelector.querySelector("[value=" + currentTheme + "]").checked = true;
} catch (e) {
	console.warn(e);
}

themeSelector.onchange = function (e) {
	currentTheme = e.target.value;
	setTheme(currentTheme);
	localStorage.setItem("webretro_settings_theme", currentTheme);
}

// modal windows (managers)
function openManager(type) {
	if (managers[type]) {
		if (managerClosed[currentManager]) managerClosed[currentManager]();
		currentManager = type;
		if (managerOpened[type]) managerOpened[type]();
		managerTitle.textContent = capitalize(managerNames[type] || type + "s");
		clearManagers();
		managers[type].style.display = "block";
		modals.style.display = "block";
	}
}

function clearManagers() {
	Object.values(managers).forEach(function (e) {
		e.style.display = "none";
	});
}

function closeManagers() {
	modals.style.display = "none";
	clearManagers();
	managerTitle.textContent = "";
	if (managerClosed[currentManager]) managerClosed[currentManager]();
	currentManager = undefined;
}

managerClose.onclick = closeManagers;

// --- code for the keybind manager ---

// convert between config strings and objects
function configStrToObj(str) {
	var convert1 = str.slice(0, -1).split("\n");
	var convert2 = {};
	for (var i = 0; i < convert1.length; i++) {
		var convert3 = convert1[i].split(" = ");
		convert2[convert3[0]] = convert3[1].slice(1, -1);
	}
	return convert2;
}

function configObjToStr(obj) {
	var convert1 = Object.keys(obj);
	var convert2 = "";
	for (var i = 0; i < convert1.length; i++) {
		convert2 += convert1[i] + ' = "' + obj[convert1[i]] + '"\n';
	}
	return convert2;
}

// load config saved in localStorage
var defaultKeybindsObj = configStrToObj(defaultKeybinds);
var savedKeybindsObj = localStorage.getItem("RetroArch_settings_keybinds") ? Object.assign(Object.assign({}, defaultKeybindsObj), configStrToObj(localStorage.getItem("RetroArch_settings_keybinds"))) : Object.assign({}, defaultKeybindsObj);
var keybindsObj = Object.assign({}, savedKeybindsObj);

var validKeybinds = Object.keys(defaultKeybindsObj);

// update the config list
function createConfigList() {
	keybindTable.innerHTML = "";
	// make the list
	for (var i = 0; i < validKeybinds.length; i++) {
		keybindTable.innerHTML += "<tr><td>" + validKeybinds[i].replace(/^input_/, "") + "</td><td>" + keybindsObj[validKeybinds[i]] + "</td></tr>";
	}
	// highlight conflicting keys
	var keysList = Object.values(keybindsObj);
	for (var i = 0; i < validKeybinds.length; i++) {
		var matches = keysList.filter(v => v == keybindsObj[validKeybinds[i]]);
		if (matches.length > 1 && !(matches[0] == "nul")) keybindTable.children[i].lastElementChild.classList.add("conflict");
	}
}

// rebinding a key
keybindTable.onclick = function (e) {
	if (e.target.tagName == "TD" && !e.target.nextElementSibling) {
		let valueElement = e.target;
		let keyNo = Array.from(keybindTable.children).indexOf(e.target.parentElement);
		valueElement.classList.remove("conflict");
		valueElement.textContent = "press a key (escape to unbind)";

		function newKeyHandler(e) {
			if (e.code == "Escape") {
				keybindsObj[validKeybinds[keyNo]] = "nul";
				createConfigList();
			} else {
				keybindsObj[validKeybinds[keyNo]] = codeToConfigIDMap[e.code] || "nul";
				createConfigList();
			}
			finishKeybindInput();
		}

		function cancelKeybindInput() {
			finishKeybindInput();
			createConfigList();
		}

		function finishKeybindInput() {
			document.removeEventListener("keydown", newKeyHandler);
			document.removeEventListener("mousedown", cancelKeybindInput);
		}
		document.addEventListener("keydown", newKeyHandler, false);
		document.addEventListener("mousedown", cancelKeybindInput, false);
	}
}

function tryApplyConfig() {
	if (mainCompleted) {
		console.log(nulKeys + configObjToStr(savedKeybindsObj) + extraConfig)
		FS.writeFile("/home/web_user/retroarch/userdata/retroarch.cfg", nulKeys + configObjToStr(savedKeybindsObj) + extraConfig);
		Module._cmd_reload_config();
	}
}

// save the keybinds to localStorage, and apply them
saveKeybinds.onclick = function () {
	savedKeybindsObj = Object.assign({}, keybindsObj);
	localStorage.setItem("RetroArch_settings_keybinds", configObjToStr(savedKeybindsObj));
	tryApplyConfig();
	alert("Saved!");
}

resetKeybinds.onclick = function () {
	if (confirm("Are you sure you want to reset all of the keybinds to their default values?")) {
		savedKeybindsObj = Object.assign({}, defaultKeybindsObj);
		keybindsObj = Object.assign({}, savedKeybindsObj);
		localStorage.removeItem("RetroArch_settings_keybinds");
		createConfigList();
		tryApplyConfig();
	}
}

// --- code for the screenshot manager ---

// zip and download all of the screenshots in the list
downloadAllScreenshots.onclick = function () {
	if (screenshotDatas.length) {
		zipFiles(replaceInFiles(screenshotDatas, "rom", romName), function (zd) {
			downloadFile(zd, "screenshots-" + getTime() + ".zip", "application/zip");
		});
	} else {
		alert("There are no screenshots to download!");
	}
}

// update the screenshot list
function createScreenshotList() {
	var screenshots = FS.analyzePath("/home/web_user/retroarch/userdata/screenshots/").exists ? FS.readdir("/home/web_user/retroarch/userdata/screenshots/").filter(k => ![".", ".."].includes(k)) : [];
	screenshotsDiv.innerHTML = "";

	for (var i = 0; i < screenshots.length; i++) {
		var screenshotData = FS.readFile("/home/web_user/retroarch/userdata/screenshots/" + screenshots[i]);
		var blobUrl = window.URL.createObjectURL(new Blob([screenshotData], {
			type: "image/png"
		}));
		screenshotDatas[i] = {
			path: screenshots[i],
			data: screenshotData.buffer
		};
		screenshotObjUrls[i] = blobUrl;
		screenshotsDiv.innerHTML += '<div class="screenshot"><img src="' + blobUrl + '"><input type="button" data-action="download" value="Download"><input type="button" data-action="delete" value="Delete">' + "</div>";
	}
}

// why I didn't just use the DOM? I don't know
screenshotsDiv.onclick = function (e) {
	if (e.target.tagName == "INPUT") {
		var screenshotNo = Array.from(screenshotsDiv.children).indexOf(e.target.parentElement);
		switch (e.target.dataset.action) {
			case "download":
				downloadFile(screenshotDatas[screenshotNo].data, screenshotDatas[screenshotNo].path.replace("rom", romName), "image/png");
				break;
			case "delete":
				if (confirm("Are you sure you want to delete this screenshot?")) {
					// doing all this is probably more efficient then reloading all of the screenshots
					window.URL.revokeObjectURL(screenshotObjUrls[screenshotNo]);
					FS.unlink("/home/web_user/retroarch/userdata/screenshots/" + screenshotDatas[screenshotNo].path);
					screenshotObjUrls.splice(screenshotNo, 1);
					screenshotDatas.splice(screenshotNo, 1);
					e.target.parentElement.remove();
				}
				break;
		}
	}
}

// --- code for the save/state manager ---

function updateQuotaDisplay() {
	navigator.storage.estimate().then(function (info) {
		quotaText.textContent = "Storage used (estimate): " + bytesToHumanReadable(info.usage) + " / " + bytesToHumanReadable(info.quota) + " (" + (info.usage / info.quota).toFixed(2) + "%)";
	});
}

// update the save list
function createSaveList() {
	updateQuotaDisplay();
	getAllIdbItems().then(function (items) {
		saveTable.innerHTML = "";
		// make the list
		for (var i = 0; i < items.length; i++) {
			if ((/^RetroArch_(saves|states)_/).test(items[i].key)) {
				var sName = items[i].key.replace(/^RetroArch_(saves|states)_/, "");
				var sType = (/^RetroArch_saves_/).test(items[i].key) ? "save" : "state";
				saveIDs.push({
					id: items[i].key,
					name: sName,
					type: sType
				});
				saveTable.innerHTML += "<tr><td>" + capitalize(sType) + ": " + sName + '</td><td><span data-action="download">Download</span><span data-action="delete">Delete</span></td></tr>';
			}
		}
	});
}

saveTable.onclick = function (e) {
	if (e.target.tagName == "SPAN") {
		let saveNo = Array.from(saveTable.children).indexOf(e.target.parentElement.parentElement);
		switch (e.target.dataset.action) {
			case "download":
				getIdbItem(saveIDs[saveNo].id).then(function (data) {
					if (saveIDs[saveNo].type == "save") {
						var files = replaceInFiles(saveArrToFiles(data), "ROMNAME", saveIDs[saveNo].name);
						if (files.length == 1) {
							downloadFile(files[0].data, "game-sram-" + saveIDs[saveNo].name + "-" + getTime() + "." + files[0].path.split(".").slice(1).join("."));
						} else {
							zipFiles(files, function (zd) {
								downloadFile(zd, "game-sram-" + saveIDs[saveNo].name + "-" + getTime() + ".zip", "application/zip");
							});
						}
					} else {
						downloadFile(data, "game-state-" + saveIDs[saveNo].name + "-" + getTime() + ".state");
					}
				});
				break;
			case "delete":
				if (confirm("Are you sure you want to delete this " + saveIDs[saveNo].type + ' for "' + saveIDs[saveNo].name + '"?') && confirm("Really really sure?")) {
					removeIdbItem(saveIDs[saveNo].id);
					saveIDs.splice(saveNo, 1);
					e.target.parentElement.parentElement.remove();
					updateQuotaDisplay();
				}
				break;
		}
	}
}

// --- master rom selector ---

function getMasterRom(files) {
	return new Promise(function (resolve) {
		// some auto detecting
		var recommendedExts = "";
		if (playlistCores.includes(core)) {
			recommendedExts = playlistExts;
		} else if (["dosbox", "dosbox_pure", "scummvm"].includes(core)) {
			recommendedExts = ".exe, .bat, .com";
		}
		if (recommendedExts) {
			var recommendedExtsArray = recommendedExts.split(", ");
			var detectedFiles = files.filter(i => recommendedExtsArray.includes("." + i.path.toLowerCase().split(".").slice(-1)[0]));
			// if ONLY one match is found, use it
			if (detectedFiles.length == 1) {
				resolve(files.indexOf(detectedFiles[0]));
				return;
			}
		}

		openManager("romSelector");
		if (recommendedExts) {
			recommendedExtensions.textContent = "Recommended file extensions: " + recommendedExts;
		} else {
			romSelectorTable.parentElement.classList.add("fulltableparent");
		}
		romSelectorTable.innerHTML = "";
		// make the list
		for (var i = 0; i < files.length; i++) {
			romSelectorTable.innerHTML += "<tr><td>" + files[i].path + "</td></tr>";
		}
		romSelectorTable.onclick = function (e) {
			closeManagers();
			resolve(Array.from(romSelectorTable.children).indexOf(e.target.parentElement));
			return;
		}
	});
}

// --- end manager-specific code ---

var managerOpened = {
	"keybind": function () {
		createConfigList();
	},
	"screenshot": function () {
		createScreenshotList();
	},
	"save": function () {
		createSaveList();
	},
	"romSelector": function () {
		managerClose.style.display = "none";
	}
};

var managerClosed = {
	"keybind": function () {
		keybindsObj = Object.assign({}, savedKeybindsObj);
	},
	"screenshot": function () {
		// clear the blob: urls used for the screenshots
		for (var i = 0; i < screenshotObjUrls.length; i++) {
			window.URL.revokeObjectURL(screenshotObjUrls[i]);
		}
		screenshotObjUrls = [];
		screenshotDatas = [];
	},
	"save": function () {
		saveIDs = [];
	},
	"romSelector": function () {
		managerClose.style.display = "initial";
	}
};

// opening the managers

keybindsButton.onclick = function (e) {
	e.preventDefault();
	openManager("keybind");
}

screenshotsButton.onclick = function (e) {
	e.preventDefault();
	openManager("screenshot");
}

savesButton.onclick = function (e) {
	e.preventDefault();
	openManager("save");
}

statesButton.onclick = function (e) {
	e.preventDefault();
	openManager("save");
};

// ---------- START LOAD ----------
(function () {
	versionIndicator.textContent = "v" + webretroVersion.toString();

	// ?system query
	// if no queries.core
	if (!queries.core && queries.system) {
		var detectedCores = allCores.filter(k => systems[k].toLowerCase() == queries.system.toLowerCase());
		var usableCores = installedCores.filter(k => systems[k].toLowerCase() == queries.system.toLowerCase());
		var usingCore = usableCores.find(k => preferredCores.includes(k)) || usableCores[0];
		if (usingCore) {
			queries.core = usingCore;
		} else if (queries.system.toLowerCase() == "autodetect") {
			queries.core = "autodetect";
		} else if (!detectedCores.length) {
			alert('Could not find any cores matching the system "' + queries.system + '".');
		} else {
			alert("Found the core(s) " + detectedCores.join(", ") + ", but none were marked as installed.");
		}
	}

	// ?core query
	if (queries.core) {
	
		try {
			if (!window.chrome) alert("Best performance on Chrome!");
		} catch (e) {
			console.warn(e);
		}

		// show menu bar
		menuBar.style.display = "block";

		if (queries.core.toLowerCase() == "autodetect") {
			romUploadCallback = autodetectCoreHandler;
			systemName.textContent = "Autodetect";
			readyRomUploads(".zip, " + allFileExts);

			document.addEventListener("DOMContentLoaded", readyLaunchQueue, false);
		} else {
			romUploadCallback = initFromFile;
			core = queries.core;

			setStatus("Getting core");
			// detect system for ROM upload
			systemName.textContent = systems[core] || "";

			// add an s to the upload button if using a multifile core
			if (multiFileCores.includes(core)) upload.value += "s";

			// show the pre-start options
			if (coreOptions[core]) {
				pso.style.display = "block";
				try {
					pso.querySelector("[data-core=" + core + "]").style.display = "block";
				} catch (e) {
					console.warn(e);
				}
			}

			getCore(core, function () {-
				removeStatus("Getting core");
				log("Got core: " + core);
				if (romMode != "querystring") document.title = (coreNames[core] || core) + (appIsPwa ? "" : " | webretro");

				readyRomUploads([".zip" + (exclusiveMultiFileCores.includes(core) ? "" : ", .bin"), (allCores.includes(core) ? getFileExtsForCore(core) : allFileExts)].filter(i => i).join(", "));
			}, function () {
				// core loading error
				alert('Could not load specified core "' + core + '". Here is a list of available cores.');
				showCoreList();
			});
		}

		// ?rom query
		if (queries.rom) {
			readyRomFetch();
		} else {
			// prompt user to upload ROM file
			romMode = "upload";
			ffd.style.display = "flex";
		}
	} else {
		// no core specified
		showCoreList();
	}
})();
// ----------- END LOAD -----------

// start emulator from file(s)
function initFromFile(files) {
	if (files.length == 1 && files[0].path.split(".").slice(-1)[0].toLowerCase() == "zip") {
		if (multiFileCores.includes(core)) {
			log("Zip file detected, unzipping... (multi-file ROM detected... probably)");

			unzipFileMulti(files[0].data, function (dataArr) {
				readyForInit(dataArr);
			}, function () {
				alert("That zip file appears to be empty!");
			});
		} else {
			log("Zip file detected, unzipping... (single-file ROM detected)");

			unzipFile(files[0].data, [".bin", getFileExtsForCore(core)].filter(i => i).join(", "), function (name, contents) {
				readyForInit([{
					path: name,
					data: contents
				}]);
			}, function () {
				alert("That zip file appears to be empty!");
			}, function () {
				alert("Couldn't find a valid ROM file in that zip file. Are you using the right core? This is " + systems[core] + ". (The ROM has to be at the base directory of the zip file)");
			});
		}
	} else {
		readyForInit(files);
	}
}

// autodetect core mode
function autodetectCoreHandler(files) {
	if (files.length == 1) {
		if (files[0].path.split(".").slice(-1)[0].toLowerCase() == "zip") {
			log("Zip file detected, unzipping...");

			unzipFile(files[0].data, allFileExts, function (name, contents) {
				autodetectCore(name, contents);
			}, function () {
				alert("That zip file appears to be empty!");
			}, function () {
				alert("Couldn't find a valid ROM file in that zip file. (The ROM has to be at the base directory of the zip file)");
			});
		} else {
			autodetectCore(files[0].path, files[0].data);
		}
	} else {
		alert("Unable to autodetect when multiple files are chosen");
	}
}

function autodetectCore(name, data) {
	var nameExt = "." + name.split(".").slice(-1)[0].toLowerCase();

	var detectedSystem = allSystems.find(k => fileExts[k].split(", ").includes(nameExt));

	var detectedCores = allCores.filter(k => systems[k] == detectedSystem);
	var usableCores = installedCores.filter(k => systems[k] == detectedSystem);
	var usingCore = usableCores.find(k => preferredCores.includes(k)) || usableCores[0];

	if (usingCore) {
		core = usingCore;

		setStatus("Getting core");

		// show the pre-start options
		if (coreOptions[core]) {
			pso.style.display = "block";
			try {
				pso.querySelector("[data-core=" + core + "]").style.display = "block";
			} catch (e) {
				console.warn(e);
			}
		}

		getCore(core, function () {
			removeStatus("Getting core");
			log("Got core: " + core);
			readyForInit([{
				path: name,
				data: data
			}]);
		});
	} else if (!detectedCores.length) {
		alert('Unrecognized file extension "' + nameExt + '". This does not mean that it is unsupported, it may just mean that it is not auto-detectable.');
	} else {
		alert("Found the core(s) " + detectedCores.join(", ") + " for system " + detectedSystem + ", but none were marked as installed.");
	}
}

// if the ROM is specified in the querystring, we will need to wait until the user has clicked to start the emulator https://goo.gl/7K7WLu
function readyForInit(files) {
	// undefine romUploadCallback to make sure initialization only happens once (it shouldn't anyway)
	romUploadCallback = function () {};

	// set the romName now if using single-file rom
	if (files.length == 1) {
		romName = files[0].path.split("/").slice(-1)[0].split(".")[0];
		document.title = romName + (appIsPwa ? "" : " | webretro");
	}

	if (queries.romshift) {
		let shift = parseInt(queries.romshift);
		for (var i = 0; i < files.length; i++) {
			files[i].data = avShift(new Uint8Array(files[i].data), shift).buffer;
		}
	}

	// remove the file drop listeners
	if (romUploadsReady) {
		document.removeEventListener("dragenter", fileDragEnter);
		document.removeEventListener("dragover", fileDragOver);
		document.removeEventListener("drop", fileDropped);
	}

	if (romMode == "querystring" && (queries.hasOwnProperty("forcestartbutton") || !isAudioAllowed())) {
		// start button (don't delete this section, audio contexts are not allowed to start until a user gesture on the page, in this case, clicking the start button) https://goo.gl/7K7WLu
		startButton.style.display = "initial";
		startButton.onclick = function () {
			startButton.style.display = "none";
			initFromData(files);
		}
	} else {
		initFromData(files);
	}
}

function loadEncodedFS(rawEncodedFS) {
	var decodedFS = {}
	const fileEntries = rawEncodedFS.split("--file");
	fileEntries.forEach(entry => {
		if (entry.trim()) {
			const parts = entry.split("\n");
			const filename = parts[0].trim();
			const base64Data = parts.slice(1).join("\n").trim();
			const binaryString = atob(base64Data);
			const byteArray = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				byteArray[i] = binaryString.charCodeAt(i);
			}
			decodedFS[filename] = byteArray;
		}
	});
	return decodedFS;
}

// prepare FS with bundle
function prepareBundle() {
	var encodedXmbDefaultFiles = `--file default.png
iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAC8VBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8xx/ZkAAAA+nRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9yc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnp+goaKjpKWnqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+a9dU1AAAC5ZJREFUGBntwXl8VeWBBuD3JiGLEQhJIBDAhU4rFxOh2FasWJHWFRRLZ9hc2qEJkIpWNKWtmkLUKJQOI1uQKZSZYaJoECwVh0aRTQxUhICGhMpSciGQhewJue9fvSQBbn7E5Dvf952be87vPA8cDofD4XA4HA6Hw+FwOBwOh0OrqMRhtz8wZVb6ywuz1+Zsycv3Kfb5qsynhj41ZT5fFRcXF+X75L2fszZ74cvpM6c8cPuwxChYVe/k8Wnz39iws6iKSqqKduSunJ82PjkGFtH3zp8v2HCgktpVHnx3QcpdCQhePYb/9D8/LqPJyne8/u8jeiDY9P3xf+ypZ8A0fLp4Yj8Ei54Tsw+xGxxe+ZOe6HY3zn6/nt2mYctTN6Ib9Und7mV3K0jvh24RMmFDA4NC44YJIQi0a1MPM4gUp8cgkOKyyhlkKl6LR6BEp5czCFVl9UIghKR5GKROp4XAdEm7GMT2joS5IuY1MKg1zIuAia7bzaC37xswzfhztIDKiTCHK9NLS/BmumCC0JW0jD/1gHYRb9JCNkZBs8ittJS8KGgV+hYtZmMYNHKtouWsdUGf+bSgedBmnJcW5H0Emlx3lpZUNgRaRHxKi/o0HDpk0LJegAZD62lZDcOgLGQ7LWxXCFTNoqWlQFF0CS3tVDTUPE+Lmwsl8RW0uIo4qHiFlvcSFESfo+WVRUPebNrALEgLOUIbKAyBrIdpCw9C1ju0hRxIiq2nLdTFQE4abSIVcnbRJj6GlOtpF95BkDGbtjETMt6nbWyChGvraRu10TBuIm3kYRi3gjbyOowroI3sh2HxXtqINw5G/Zi2MgFG/YG2shBGfUJb2QWDwupoK7VhMGY4bSYJxjzBoND4xYfrFv92+kOjRg4Z2CcMPpFxQ0ZSwmMwZjG7WcmHK58Z/80wdOBaSlgEYz5m9ynd8MKDCfh6/SjhQxhzjt3j7P/9IsmFzl1PCWdgSF92A+/ezO+Homu3UEYsjBjNgCvI+CbE/JAyRsGI6QysE/P+BcL+lTJ+CiNeYwA15Y4PhQGzKOMVGJHLgKlefAOMeZEy1sOI/QyQ0ufjYNQblLEXRpQzIKqzesO4LZRRCgN6MRAas/tDxmFKiYa4ZAbAtmGQU0UpQyFuHE1XluqCnFjKuRfiZtJs6+Ih67uUkwJx82mu2qch7wnKeRHismmq/G9BQRblLIW4t2mmVeFQkUs5b0HcDprHmwE1hZSzDeKKaJrqR6AmvIlyvoS4Sprl3K3owjdmZmbOGIKvlUxJ5RAWSbOcHYHOjfiALbYMx9f4GSV5wyFqAE1SOhydm1rHNnVT0LHllJUAUW6a42wyOndfEy9rugcd2kdZN0HU92mKxrHoXNQJ+jl5DTpwTRNlfQ+iHqAZvI+hC0+ynTR0YDSl3QtRU2iGeejK/7OdLejAM5T2bxA1iyZY70JXPGznFDqQQ2mpEDWXWtXQ53gfdKmB7dTjaq5TlPYsRGVSm8bcGUPXkbxwF7p2ku0cx9WGU14GRC2iJsd/1R8YS5+XIOBdtpOLq6VT3gKIWkEtzs2JBNCjgGR+Dwh4lO1MxdX+SnlLIWotdfjfWFw0h6T3NogIK6CfA6G4Ss8GylsNUeuprmIyWgw8T/KPEDO8ipdVJeNqD1NBDkRtprIiN1plk6xIgKDRp9nGcwc6sIwK3oOoj6hqZzxaJdaT/CWEJSytpk/1kn7oSDEV5EHUbira0RNtFpI8Hg4DIsc+8cTdkehQElXshKh8qvmkF9rEVZF8CrrMo4o9EPUZlfw9AZdkkDwbDV0OU8VeiDpAFeeH4ZJrzpH8NXQZQSX7IeoQVUzGZVNJVvSGLq9RSQFEFVLBSlyxmeQS6BJWQiVfQtRRyjsVg8sSmkh+F7pMoJoiiDpGeY/gijkkD0GbXKr5O0SdpLT18LOf5K+gS2Ij1ZyEKA9lVSfiiiSSFwZCl0wqKoGoUsp6BX6eIZkHXaJKqagUoiooqSIWfjaTfA66pFBVGURVUdIL8BNRTXIENHEdoKrzEFVHOfV94WcMyRIXNJlIZTUQ1Ug5f4S/TJJroIkrn8oaIKqZcu4eete0X2ZmLc7OXpE1Z9JnJKdBkwlU1wxRzdRlEPRw7aW6ZohqpCZnoMlj1KABouqoyfvQI+oYNaiBqCpq8ir0+A11OA9R5dRkKrQYcJ46lEHUWWrihhZvUoszEOWhHg2h0OFh6lECUf+gHsXQoedx6nECoo5Rj23QYRk1+QqijlKP/4EGD3qpSRFEFVKPV6FuYCl1+QKiDlOPp6AsZCu1OQhRB6jHRCjLpD77Iepv1ONOqJripT77ICqfetwKRbfWUKNPIGo39bgZagaXUKedELWNegyBkr4HqVUeRG2mHgOgImYv9doEUeupRwwU9N5DzXIgai31iIS82F3UbQ1EZVOPYZB2w2Fqtwyi/kA9TidBUvIJ6rcAol6iJh43pNx/niaYB1FzqYvHDePCMptphnSI+gW1OZ0EoxI+oDlmQNQ06uNxw5iHztAkkyFqHDXyuGFA4pu86OR56nc/RN1BnU4nQZQrtZIXbb3NS/1GQdTN1Mrjhph79vCiujkhT9MEbogaSL08bgi4+2O22DMM2E4TJEJUNNU1Lh0zZOyqJrbwuNEF1z15bFHxVCgwkmaIgrBqqjoyAhfd6WELjxud6ffcEbZoXjMAPn+iCc5D3FEqOjoYrQYfZQuPG18n8oF1DWz1lxG4aEgDTVAEcbuppjYZl9xSzRYeNzqSMP3tarbyvjcarXJohp0Q9y7VPIkr0tjK40Z7rpseXbynmW3q1oxAm9FemiEX4lZRyd4QXBFRwVYeN9rEDH9o9sKtFbzii+ficUnUIZoiG+JeppIfwN9HbOPJXp3z5w/yD1SyvROLvgM/i2iO+RA3myp2oJ1P2JnjL450wd+9zTRHGsRNoIoJ8Nf/AjuTi/ZuLKVJxkHcSCr4IgT+lrJT+9FO74M0yy0QF08Fs+Bvmped8sBf1Ec0TQwMqKG0+lj4ebKZnauAn/CNNE0ljDhMae/gin5vsyu1uCJqE81zEEZsprSf4JKIZ8vZpVJc1nMrTbQJRiymrJootOqfUUIBRbhk0H6aaRGMSKOs93BRyOj/bqCQfWhz+0maagaM+BFlPQng5oxiispDC9fTDTTXGBgxmLLuTVl3hgbk4KLYd2m2RBjhqmaAZMHnvmM0WyWM+ZQBkgLErqH5dsOYlQyQsaHTPQyA5TBmJgPk8c8ZEKkw5jbazHdgTGQjbaUpEgZ9Tlv5HEZl01aWw6hHaStTYdQg2spgGPYVbaQYxq2ljayGcY/TRqbCuLgLtI0LcZCwg7bxEWTMpW08BxnJtI1hkHKANnEQcubSJp6FnOuaaQvNgyApj7bwAWQ9TluYBlnhp2gD/wiHtOdpA7+GvL61tLzaeCjIpuWtgIqBtbS4usFQ8nta3AKoia+kpVXEQdFvaWlzoSq8gBZ2OALKRjXTsprvgAbLaFlLoEOvQlpUYS9okVxDS6r7NjSZRkv6GbR5gxb0BvQJXU/L2RQGjaK20WJ2R0OrmL/RUvbHQrOYbbSQ3fHQLuItWsbGa2CCsBW0iJVhMMej1bSAuhSYZmgBg17hcJjo2sXNDGrNr/eEub69l0GscAxM1yO9nEGqYm44AqFPVi2DUEN2PwTKwCXVDDI1ywcjkHo9fYxBpCQjHoHWY9KfLzAoXPjL5B7oFnGp29ntCjKuRzf61jN/bWK3acqbcxO6XcykVV+yGxz5r8l9ECwGTFqyr5EB0/jZssmJCDbhI6cv2VFGk1XsWpZyawSCV78fpCzY8Hk5tas8uHFh6pj+sIheN4+b+bvl72wvrKKSqiM7clf8btb4pN6wqqgB7lH3T5qRPv/V7NU5m7fm+xwq9jlXVlZWRZ+qsrKyc8U+h/J9tm7OWZ2dNS89ddJ9o4YOiILD4XA4HA6Hw+FwOBwOh8PhcOj0T2rpcmmRWzKQAAAAAElFTkSuQmCC

--file default-content.png
iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAACl1BMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jrjphAAAA3HRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRscHR4gISIjJCUnKCkqKywtLi8xMjM1Njg5Ojw9Pj9AQUJDREVGR0hJSktMTU5PUFFSVFVWV1haW11eX2BjZGVmZ2hpamtucXN1dnd4ent9f4CBgoOEhYeIiYqLjI2QkZKTlJWWl5iZmpyeoKGio6Slpqeoqqusr7CxsrO1tre4ubq8vb6/wMHCw8TFxsfIysvMzc/Q0dLT1NXW19jZ2tvc3d7f4OLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+fuOiugAABX5JREFUGBntwftflYUdB/DPQcDLkdgUeVBpWWlpllrr5py27qxyrGU3KrMLG0a7lGFjrpvOykutvLSVw1q0rVII4nSlMi+YEs4maML5/DGDcw7wnBfHc31+8Pvweb8hIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIuK9gplXVq743bpt/9ndvvfbk+zXc7h9N0aDsivvXr3905NM4Dv4XMmNj77WwVM7CB+b/Is/t4aZ3FfwqcC8mn/1MrUP4Euzaz9lev4B/5m+8jOm7WX4TH7F9l5m4Gn4SnDFl8xMLXyk5LeHmam74BvB6iPM3BL4REHVAWZjFvzh8jZmZyL84IfPhZmdTvhB5SFm6z3YN76e2VsP8+Z/whxUw7o7TzAXFbAtUMvcnAvTgq8yNyfyYdmkXUzh82dqap5t5ym1wLLJTUyuaTEiljTzFP4Cw0qamdzGcYgZt4mJ3Qu7JrcwudfzMSR/BxO6CGYVNDC57ulwmXaMCRzLh1WBF5jCGsR5igk0wqyVTOWniLOECayGVTeHmYqDOFOZwFLYMwH9yr9lSoWIM5YjhafCloKKZz+qBDDmLaY2DXHKOVIzTCl/7ADZgH6/YRpuQJwKjvQ4DJlU10Py+/MBzP+eaXgRcTZypJ/Ajl92ckAdgMC7TMfJ8+Eyp5cjHC2EFcWbGbG3CMAdTE/zRAyZ2MKRtsKKs0OMqgJQ3ME0NZYixnmHCdwHI358iFH7xgJ4kmnrWB5Ev+D9B5nIDNhw6VHGPAig/AQz0NOwfv3OHibUChsu/i9jDk8EUE+vrIQJP+rgoEcATP4fvTILFhS1cdCxSQD+QK80wYTNHLIRQPEReuUhWHA3h10N4H565WQZDJjaxSEd+QDeo1e2wIJXOawOwHn0TAUMuJkucwE8Rq/sK8DpL7iPw1oBjNlLr9TAgF/TZTWAhfRKdwlOf8WddLkawCp6ZS0MeJQux4MAmuiR8Byc/sZ+Q5c3AZSF6ZFXYMAddKsBsIweCc+HATs/emvDkzXVK6qq7qmue+lCABvokS2w6Wt6IzwPJk2hR16ATVfRG91nwqaH6Y3fw6iN9MT+IhgVoidugVGFvfTCVlg1g144Wg6rLqcX7oNZt9IDrwVg1sPM3d4S2FXPnPUtgmGvMGc1sOxt5mpTAJbtYo52TYBpHzI3e8pgWztz8s1sGLefueiaB+u6mIMjC2BeD7PXeQnsa2PWvpwFHyhtZZZapsMXnBCz8vci+ERpKzPXW5sH3yhtZaY6FsNPnBAzs20K/MUJMQP7bsGAaUXwj9JWpiv83BkYsOjdAHzECTE9OxZgwLi6vj/CV5wQ07DzMkQsaCMvg3kFy99sb7gzHxFOiCmEdyxERHF9L7kb5p3TxAFvO4hwQkzm4KpzEJG3bD/73QbrztrDqD1nIcIJ8VR6/lZZiKifNXFAeyGMG9/CQR8EEeGEmEjHupuCiApc28iopbBuDYc9hSgnxHjhj19csSAPMeOWNTGmMQDj5vVx2PFiRDkhxnQ1b/vTg4uKMWzmqkMc1HMerPsn3a5AjFN1+9JrFs+fcwbiTX/gfbo8AOsuZZyLkUx57e4w3d7Ig3Vb6HZgDJKpYLwvSmDdzD66LUdScxnnyGyY9zTdNgSQlEO37itg3thOuqzJQ3LFdDlxPez7OYcdvAmpjOewnuvgA3/loONP/AAplXDI0UXwgQndjDrwSBnScDYHfT0XfnAtB/Q1/qoQabmIMf+eBl9YQ7KtdgbStZAR4fpC+MMbayunIANLOaDzBoxW1ez3+pkYtdaSXVUBjF4NvescjGbPXwARERERERERERERERERERERERERERERERERERERERERERERERERkYz9HxhfN47j9qrsAAAAAElFTkSuQmCC
`;
	var encodedCheatFiles = `--file SuperMario64.cht
Y2hlYXRzID0gMjQKY2hlYXQwX2Rlc2MgPSAiUHJlc3MgR1MgRm9yIDI1NSBDb2lucyIKY2hlYXQwX2VuYWJsZSA9IGZhbHNlCmNoZWF0MF9jb2RlID0gIjg5MzA5NEQ4IDAwRkYiCmNoZWF0MV9kZXNjID0gIkhhdmUgTGV2ZWwgU2VsZWN0IgpjaGVhdDFfZW5hYmxlID0gZmFsc2UKY2hlYXQxX2NvZGUgPSAiQTAyRjk3M0MgMDAwMSIKY2hlYXQyX2Rlc2MgPSAiRG9uJ3QgSHVydCBNYXJpbyBNb25zdGVycyIKY2hlYXQyX2VuYWJsZSA9IGZhbHNlCmNoZWF0Ml9jb2RlID0gIjgwMzA5NDU3IDAwMDEiCmNoZWF0M19kZXNjID0gIkluZmluaXRlIExpdmVzIgpjaGVhdDNfZW5hYmxlID0gZmFsc2UKY2hlYXQzX2NvZGUgPSAiODAzMDk0REQgMDA2NCIKY2hlYXQ0X2Rlc2MgPSAiSW5maW5pdGUgRW5lcmd5ICYgQnJlYXRoIgpjaGVhdDRfZW5hYmxlID0gZmFsc2UKY2hlYXQ0X2NvZGUgPSAiODAzMDk0REUgMDAwOCIKY2hlYXQ1X2Rlc2MgPSAiRGVidWcgTW9kZSIKY2hlYXQ1X2VuYWJsZSA9IGZhbHNlCmNoZWF0NV9jb2RlID0gIkEwMkY5NzQ4IFhYWFgiCmNoZWF0Nl9kZXNjID0gIk1hcmlvJ3MgQ2FwIE9mZiBPcHRpb25zIgpjaGVhdDZfZW5hYmxlID0gZmFsc2UKY2hlYXQ2X2NvZGUgPSAiODAzMDk0MzcgWFhYWCIKY2hlYXQ3X2Rlc2MgPSAiTWFyaW8ncyBDYXAgT24gT3B0aW9ucyIKY2hlYXQ3X2VuYWJsZSA9IGZhbHNlCmNoZWF0N19jb2RlID0gIjgwMzA5NDM3IFhYWFgiCmNoZWF0OF9kZXNjID0gIk1hcmlvJ3MgQ2FwIE9mZiAmIGluIEhpcyBIYW5kIgpjaGVhdDhfZW5hYmxlID0gZmFsc2UKY2hlYXQ4X2NvZGUgPSAiODAzMDk0MzcgWFhYWCIKY2hlYXQ5X2Rlc2MgPSAiTWFyaW8ncyBDYXAgT24gJiBBbiBFeHRyYSBpbiBIaXMgSGFuZCIKY2hlYXQ5X2VuYWJsZSA9IGZhbHNlCmNoZWF0OV9jb2RlID0gIjgwMzA5NDM3IFhYWFgiCmNoZWF0MTBfZGVzYyA9ICJQcmVzcyBMIFRvIExldml0YXRlIgpjaGVhdDEwX2VuYWJsZSA9IGZhbHNlCmNoZWF0MTBfY29kZSA9ICJEMDMwOTI2MSAwMDIwOzgxMzA5NDdDIDQyMjA7RDAzMDkyNjEgMDAyMDs4MTMwOTQzQyAwMzAwO0QwMzA5MjYxIDAwMjA7ODEzMDk0M0UgMDg4MCIKY2hlYXQxMV9kZXNjID0gIkhhdmUgQWxsIDEyMCBTdGFycyIKY2hlYXQxMV9lbmFibGUgPSBmYWxzZQpjaGVhdDExX2NvZGUgPSAiODAyMDJGMjMgMDAwMTs4MDIwMkYwQiAwMEM3OzUwMDAxMTAxIDAwMDA7ODAyMDJGMEMgMDBGRiIKY2hlYXQxMl9kZXNjID0gIkhhdmUgYWxsIGtleSBkb29ycyB1bmxvY2tlZCAoYW5kIG1vdGUgZW1wdHkpIgpjaGVhdDEyX2VuYWJsZSA9IGZhbHNlCmNoZWF0MTJfY29kZSA9ICI4MDIwMkYwQSAwMDdFIgpjaGVhdDEzX2Rlc2MgPSAiSGF2ZSBBbGwgTWF4IDEwMCBDb2luIFJlY29yZHMgRm9yIEFsbCBMZXZlbHMiCmNoZWF0MTNfZW5hYmxlID0gZmFsc2UKY2hlYXQxM19jb2RlID0gIjUwMDAwRjAxIDAwMDA7ODAyMDJGMjUgMDA2NCIKY2hlYXQxNF9kZXNjID0gIkhhdmUgQWxsIDEyMCBTdGFycyIKY2hlYXQxNF9lbmFibGUgPSBmYWxzZQpjaGVhdDE0X2NvZGUgPSAiODAyMDJGOTMgMDAwMTs4MDIwMkY3QiAwMEM3OzUwMDAxMTAxIDAwMDA7ODAyMDJGN0MgMDBGRiIKY2hlYXQxNV9kZXNjID0gIkhhdmUgYWxsIGtleSBkb29ycyB1bmxvY2tlZCAoYW5kIG1vdGUgZW1wdHkpIgpjaGVhdDE1X2VuYWJsZSA9IGZhbHNlCmNoZWF0MTVfY29kZSA9ICI4MDIwMkY3QSAwMDdFIgpjaGVhdDE2X2Rlc2MgPSAiSGF2ZSBBbGwgTWF4IDEwMCBDb2luIFJlY29yZHMgRm9yIEFsbCBMZXZlbHMiCmNoZWF0MTZfZW5hYmxlID0gZmFsc2UKY2hlYXQxNl9jb2RlID0gIjUwMDAwRjAxIDAwMDA7ODAyMDJGOTUgMDA2NCIKY2hlYXQxN19kZXNjID0gIkhhdmUgQWxsIDEyMCBTdGFycyIKY2hlYXQxN19lbmFibGUgPSBmYWxzZQpjaGVhdDE3X2NvZGUgPSAiODAyMDMwMDMgMDAwMTs4MDIwMkZFQiAwMEM3OzUwMDAxMTAxIDAwMDA7ODAyMDJGRUMgMDBGRiIKY2hlYXQxOF9kZXNjID0gIkhhdmUgYWxsIGtleSBkb29ycyB1bmxvY2tlZCAoYW5kIG1vdGUgZW1wdHkpIgpjaGVhdDE4X2VuYWJsZSA9IGZhbHNlCmNoZWF0MThfY29kZSA9ICI4MDIwMkZFQSAwMDdFIgpjaGVhdDE5X2Rlc2MgPSAiSGF2ZSBBbGwgTWF4IDEwMCBDb2luIFJlY29yZHMgRm9yIEFsbCBMZXZlbHMiCmNoZWF0MTlfZW5hYmxlID0gZmFsc2UKY2hlYXQxOV9jb2RlID0gIjUwMDAwRjAxIDAwMDA7ODAyMDMwMDUgMDA2NCIKY2hlYXQyMF9kZXNjID0gIkhhdmUgQWxsIDEyMCBTdGFycyIKY2hlYXQyMF9lbmFibGUgPSBmYWxzZQpjaGVhdDIwX2NvZGUgPSAiODAyMDMwNzMgMDAwMTs4MDIwMzA1QiAwMEM3OzUwMDAxMTAxIDAwMDA7ODAyMDMwNUMgMDBGRiIKY2hlYXQyMV9kZXNjID0gIkhhdmUgYWxsIGtleSBkb29ycyB1bmxvY2tlZCAoYW5kIG1vdGUgZW1wdHkpIgpjaGVhdDIxX2VuYWJsZSA9IGZhbHNlCmNoZWF0MjFfY29kZSA9ICI4MDIwMzA1QSAwMDdFIgpjaGVhdDIyX2Rlc2MgPSAiSGF2ZSBBbGwgTWF4IDEwMCBDb2luIFJlY29yZHMgRm9yIEFsbCBMZXZlbHMiCmNoZWF0MjJfZW5hYmxlID0gZmFsc2UKY2hlYXQyMl9jb2RlID0gIjUwMDAwRjAxIDAwMDA7ODAyMDMwNzUgMDA2NCIKY2hlYXQyM19kZXNjID0gIkJsaiBBbnl3aGVyZSIKY2hlYXQyM19lbmFibGUgPSBmYWxzZQpjaGVhdDIzX2NvZGUgPSAiRDAzM0FGQTAgMDBBMDtEMDMzQjFDNCAwMEMxOzgxMzNCMUJDIEMyMjA7RDAzM0FGQTAgMDBBMDtEMDMzQjFDNCAwMEMyOzgxMzNCMUJDIEMyMjAi

--file MarioKart64.cht
Y2hlYXRzID0gMTEKY2hlYXQwX2Rlc2MgPSAiSW5maW5pdGUgSXRlbXMiCmNoZWF0MF9lbmFibGUgPSBmYWxzZQpjaGVhdDBfY29kZSA9ICI4MDE2NUZCRCBYWFhYIgpjaGVhdDFfZGVzYyA9ICJIYXZlIEJvbnVzIE1vZGUgYW5kIEFsbCBHb2xkIEN1cHMiCmNoZWF0MV9lbmFibGUgPSBmYWxzZQpjaGVhdDFfY29kZSA9ICI1MDAwMDQwMiAwMDAwOzgwMThFRDcwIFhYWFgiCmNoZWF0Ml9kZXNjID0gIk9mZi1Sb2FkIFRpcmVzXFBsYXllciAxIgpjaGVhdDJfZW5hYmxlID0gZmFsc2UKY2hlYXQyX2NvZGUgPSAiNTAwMDA0MTggMDAwMDs4MTBGNkI5NCAwMTQwIgpjaGVhdDNfZGVzYyA9ICJPZmYtUm9hZCBUaXJlc1xQbGF5ZXIgMiIKY2hlYXQzX2VuYWJsZSA9IGZhbHNlCmNoZWF0M19jb2RlID0gIjUwMDAwNDE4IDAwMDA7ODEwRjc5NkMgMDEwMCIKY2hlYXQ0X2Rlc2MgPSAiT2ZmLVJvYWQgVGlyZXNcUGxheWVyIDMiCmNoZWF0NF9lbmFibGUgPSBmYWxzZQpjaGVhdDRfY29kZSA9ICI1MDAwMDQxOCAwMDAwOzgxMEY4NzQ0IDAxMDAiCmNoZWF0NV9kZXNjID0gIk9mZi1Sb2FkIFRpcmVzXFBsYXllciA0IgpjaGVhdDVfZW5hYmxlID0gZmFsc2UKY2hlYXQ1X2NvZGUgPSAiNTAwMDA0MTggMDAwMDs4MTBGOTUxQyAwMTAwIgpjaGVhdDZfZGVzYyA9ICJQcmVzcyBHU1xGb3IgRnVsbCBEZWJ1ZyBNZW51IgpjaGVhdDZfZW5hYmxlID0gZmFsc2UKY2hlYXQ2X2NvZGUgPSAiODgxOEVFNEYgMDAwMiIKY2hlYXQ3X2Rlc2MgPSAiUHJlc3MgTCBUbyBMZXZpdGF0ZVxQbGF5ZXIgMSIKY2hlYXQ3X2VuYWJsZSA9IGZhbHNlCmNoZWF0N19jb2RlID0gIkQwMEY2OTc1IDAwMjA7ODEwRjZBMjggNDAwMCIKY2hlYXQ4X2Rlc2MgPSAiUHJlc3MgTCBUbyBMZXZpdGF0ZVxQbGF5ZXIgMiIKY2hlYXQ4X2VuYWJsZSA9IGZhbHNlCmNoZWF0OF9jb2RlID0gIkQwMEY2OTg1IDAwMjA7ODEwRjc4MDAgNDAwMCIKY2hlYXQ5X2Rlc2MgPSAiUHJlc3MgTCBUbyBMZXZpdGF0ZVxQbGF5ZXIgMyIKY2hlYXQ5X2VuYWJsZSA9IGZhbHNlCmNoZWF0OV9jb2RlID0gIkQwMEY2OTk1IDAwMjA7ODEwRjg1RDggNDAwMCIKY2hlYXQxMF9kZXNjID0gIlByZXNzIEwgVG8gTGV2aXRhdGVcUGxheWVyIDQiCmNoZWF0MTBfZW5hYmxlID0gZmFsc2UKY2hlYXQxMF9jb2RlID0gIkQwMEY2OUE1IDAwMjA7ODEwRjkzQjAgNDAwMCIK

--file SuperMarioBros.cht
Y2hlYXRzID0gMyAKCmNoZWF0MF9kZXNjID0gIlNsb3dlciBSdW5uaW5nIgpjaGVhdDBfY29kZSA9ICJBWlNMUElBSyIKY2hlYXQwX2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQxX2Rlc2MgPSAiRmFzdGVyIEp1bXBzIgpjaGVhdDFfY29kZSA9ICJBVVNVUExBWiIKY2hlYXQxX2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQyX2Rlc2MgPSAiRG9uJ3QgTG9zZSBQb3dlci1VcHMgV2hlbiBIaXQiCmNoZWF0Ml9jb2RlID0gIlNYVUxLTlNFIgpjaGVhdDJfZW5hYmxlID0gZmFsc2UgCgpUR0FQIgpjaGVhdDJfZW5hYmxlID0gZmFsc2UgCgo=

--file SonicTheHedgehog.cht
Y2hlYXRzID0gMjkgCgpjaGVhdDBfZGVzYyA9ICJFbmFibGUgU3RhZ2UgU2VsZWN0IgpjaGVhdDBfY29kZSA9ICJGRkZGRDA6MDEwMCIKY2hlYXQwX2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQxX2Rlc2MgPSAiRW5hYmxlIERlYnVnIE1vZGUiCmNoZWF0MV9jb2RlID0gIkZGRkZGQTowMTAwIgpjaGVhdDFfZW5hYmxlID0gZmFsc2UgCgpjaGVhdDJfZGVzYyA9ICJJbmZpbml0ZSBSaW5ncyIKY2hlYXQyX2NvZGUgPSAiRkZGRTIwOjAwQzgiCmNoZWF0Ml9lbmFibGUgPSBmYWxzZSAKCmNoZWF0M19kZXNjID0gIkluZmluaXRlIExpdmVzIgpjaGVhdDNfY29kZSA9ICJGRkZFMTI6MDAwOSIKY2hlYXQzX2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQ0X2Rlc2MgPSAiU3RhZ2UvQWN0IE1vZGlmaWVyIgpjaGVhdDRfY29kZSA9ICJGRkZFMTA6eHh5eSIKY2hlYXQ0X2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQ1X2Rlc2MgPSAiTWFrZXMgU29uaWMgSW52dWxuZXJhYmxlIFRvIEVuZW1pZXMsIEJ1bGxldHMsIEFuZCBTcGlrZXMgVW50aWwgSGUgUGlja3MgVXAgQW5vdGhlciBTaGllbGQiCmNoZWF0NV9jb2RlID0gIjAwMzlGMDoxMUMxIgpjaGVhdDVfZW5hYmxlID0gZmFsc2UgCgpjaGVhdDZfZGVzYyA9ICJBZXJpYWwgVmlldyBvZiBBIExldmVsIgpjaGVhdDZfY29kZSA9ICIwMDM5RkM6MzFDMSIKY2hlYXQ2X2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQ3X2Rlc2MgPSAiR2l2ZXMgU29uaWMgVHVyYm8gU2hvZXMgV2l0aCBFdmVyeSBUViBIZSBCcmVha3MiCmNoZWF0N19jb2RlID0gIjAwQTM1RTo2MDQyIgpjaGVhdDdfZW5hYmxlID0gZmFsc2UgCgpjaGVhdDhfZGVzYyA9ICJCZWdpbiBXaXRoIFNldmVyYWwgSHVuZHJlZCBSaW5ncyBPbiBFYWNoIExldmVsIgpjaGVhdDhfY29kZSA9ICIwMDMyNDI6NjAxMCIKY2hlYXQ4X2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQ5X2Rlc2MgPSAiQmVnaW4gVGhlIEdhbWUgV2l0aCA5OSBMaXZlcyIKY2hlYXQ5X2NvZGUgPSAiMDAzMzRBOjAwNjMiCmNoZWF0OV9lbmFibGUgPSBmYWxzZSAKCmNoZWF0MTBfZGVzYyA9ICJJbmZpbml0ZSBMaXZlcyIKY2hlYXQxMF9jb2RlID0gIjAxMzhBMDo2MDMyIgpjaGVhdDEwX2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQxMV9kZXNjID0gIlN1cGVyIFNwZWVkISIKY2hlYXQxMV9jb2RlID0gIkZGRjc2MTo2NDExIgpjaGVhdDExX2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQxMl9kZXNjID0gIkludmluY2liaWxpdHkgKEVuZW1pZXMgQ2FuJ3QgVG91Y2ggWW91KSIKY2hlYXQxMl9jb2RlID0gIkZGRDAzMTpGRiIKY2hlYXQxMl9lbmFibGUgPSBmYWxzZSAKCmNoZWF0MTNfZGVzYyA9ICJJbnZpbmNpYmlsaXR5IChBbHdheXMgSGF2ZSBTaGllbGQpIgpjaGVhdDEzX2NvZGUgPSAiRkZGRTJDOjAwIgpjaGVhdDEzX2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQxNF9kZXNjID0gIkludmluY2liaWxpdHkgKFN0YXJtYW4gRWZmZWN0KSIKY2hlYXQxNF9jb2RlID0gIkZGRkUyRDowMSIKY2hlYXQxNF9lbmFibGUgPSBmYWxzZSAKCmNoZWF0MTVfZGVzYyA9ICJTZXQgVG90YWwgVGltZSBUbyAwOjAxIgpjaGVhdDE1X2NvZGUgPSAiRkZGRTI0OjAwIgpjaGVhdDE1X2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQxNl9kZXNjID0gIkluZmluaXRlIFRpbWUgVW5kZXJ3YXRlciBGb3IgU29uaWMiCmNoZWF0MTZfY29kZSA9ICJGRkZFMTU6RkEiCmNoZWF0MTZfZW5hYmxlID0gZmFsc2UgCgpjaGVhdDE3X2Rlc2MgPSAiRGVmZWF0IFN0YWdlIDEgUm9ib3RuaWsgQm9zcyBXaXRoIDEgSGl0IgpjaGVhdDE3X2NvZGUgPSAiRkZEOTIxOjAxIgpjaGVhdDE3X2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQxOF9kZXNjID0gIkRlZmVhdCBTdGFnZSAyIFJvYm90bmlrIEJvc3MgV2l0aCAxIEhpdCIKY2hlYXQxOF9jb2RlID0gIkZGRDgyMTowMSIKY2hlYXQxOF9lbmFibGUgPSBmYWxzZSAKCmNoZWF0MTlfZGVzYyA9ICJEZWZlYXQgU3RhZ2UgMyBSb2JvdG5payBCb3NzIFdpdGggMSBIaXQiCmNoZWF0MTlfY29kZSA9ICJGRkRBMjE6MDEiCmNoZWF0MTlfZW5hYmxlID0gZmFsc2UgCgpjaGVhdDIwX2Rlc2MgPSAiRGVmZWF0IFN0YWdlcyA0ICYgNSBSb2JvdG5payBCb3NzZXMgV2l0aCAxIEhpdCIKY2hlYXQyMF9jb2RlID0gIkZGRDg2MTowMSIKY2hlYXQyMF9lbmFibGUgPSBmYWxzZSAKCmNoZWF0MjFfZGVzYyA9ICJEZWZlYXQgRmluYWwgU3RhZ2UgUm9ib3RuaWsgQm9zcyBXaXRoIDEgSGl0IgpjaGVhdDIxX2NvZGUgPSAiRkZGRTVGOjAxIgpjaGVhdDIxX2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQyMl9kZXNjID0gIlNldCBBbGwgQ2hhb3MgRW1lcmFsZHMiCmNoZWF0MjJfY29kZSA9ICJGRkZFNTc6MDYiCmNoZWF0MjJfZW5hYmxlID0gZmFsc2UgCgpjaGVhdDIzX2Rlc2MgPSAiU3dpdGNoIEYvWCBPbiBGb3IgTGV2aXRhdGUgSnVtcCIKY2hlYXQyM19jb2RlID0gIkZGRDAxMjpGRSIKY2hlYXQyM19lbmFibGUgPSBmYWxzZSAKCmNoZWF0MjRfZGVzYyA9ICJGYXN0ZXIgTXVzaWMiCmNoZWF0MjRfY29kZSA9ICJGRkYwMDE6MDAiCmNoZWF0MjRfZW5hYmxlID0gZmFsc2UgCgpjaGVhdDI1X2Rlc2MgPSAiSHlwZXIgTW9kZSAoU29uaWMpIgpjaGVhdDI1X2NvZGUgPSAiRkZEMDFFOjAwIgpjaGVhdDI1X2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQyNl9kZXNjID0gIlNvbmljIENvbG9yIE1vZGlmaWVyIgpjaGVhdDI2X2NvZGUgPSAiRkZGQjA0Oj8/K0ZGRkIwNTo/PytGRkZCMDY6Pz8rRkZGQjA3Oj8/K0ZGRkIwODo/PytGRkZCMDk6Pz8rRkZGQjBBOj8/K0ZGRkIwQjo/PyIKY2hlYXQyNl9lbmFibGUgPSBmYWxzZSAKCmNoZWF0MjdfZGVzYyA9ICJTb25pYyBTbmVha2VyIENvbG9yIE1vZGlmaWVyIChCYXNlIENvbG9yKSIKY2hlYXQyN19jb2RlID0gIkZGRkIxOTo/PytGRkZCMUE6Pz8rRkZGQjFCOj8/IgpjaGVhdDI3X2VuYWJsZSA9IGZhbHNlIAoKY2hlYXQyOF9kZXNjID0gIldhcnAgVG8gRW5kIG9mIFN0YWdlIgpjaGVhdDI4X2NvZGUgPSAiRkZEMDA4OjAwIgpjaGVhdDI4X2VuYWJsZSA9IGZhbHNlIAoK
`;

	setStatus("Getting assets");
	log("Starting bundle fetch");
	let bundleSTime = performance.now();

	// grab(bundleCdnLatest + "bundle/indexedfiles-v2.txt", "text", function (data) {
	try {
		data2 = `[["", "assets"], ["/assets", "menu_widgets"], ["/assets", "xmb"], ["/assets/xmb", "png"], ["/assets/xmb/png", "dark"], ["/assets/xmb/png", "gruvbox_dark"], ["/assets/xmb/png", "light"], ["/assets/xmb/png", "nord"], ["/assets/xmb/png", "sidebar"], ["/assets", "xmb"], ["/assets/xmb", "monochrome"], ["/assets/xmb/monochrome", "png"], ["", "shaders"], ["/shaders", "shaders_glsl"], ["/shaders/shaders_glsl", "anti-aliasing"], ["/shaders/shaders_glsl/anti-aliasing", "shaders"], ["/shaders/shaders_glsl/anti-aliasing/shaders", "aa-shader-4.0-level2"], ["/shaders/shaders_glsl/anti-aliasing/shaders", "reverse-aa-post3x"], ["/shaders/shaders_glsl", "crt"], ["/shaders/shaders_glsl/crt", "shaders"], ["/shaders/shaders_glsl/crt/shaders", "crt-easymode-halation"], ["/shaders/shaders_glsl/crt/shaders", "crt-hyllian-glow"], ["/shaders/shaders_glsl/crt/shaders", "crt-hyllian-multipass"], ["/shaders/shaders_glsl/crt/shaders", "crt-interlaced-halation"], ["/shaders/shaders_glsl/crt/shaders", "crt-lottes-multipass"], ["/shaders/shaders_glsl/crt/shaders", "glow"], ["/shaders/shaders_glsl", "cubic"], ["/shaders/shaders_glsl/cubic", "shaders"], ["/shaders/shaders_glsl", "eagle"], ["/shaders/shaders_glsl/eagle", "shaders"], ["/shaders/shaders_glsl", "interpolation"], ["/shaders/shaders_glsl/interpolation", "shaders"], ["/shaders/shaders_glsl", "scalefx"], ["/shaders/shaders_glsl/scalefx", "shaders"], ["/shaders/shaders_glsl", "scalehq"], ["/shaders/shaders_glsl/scalehq", "shaders"], ["/shaders/shaders_glsl", "xbrz"], ["/shaders/shaders_glsl/xbrz", "shaders"], ["/shaders/shaders_glsl/xbrz/shaders", "xbrz-freescale-multipass"]],,,
/assets/menu_widgets/msg_queue_icon.png
/assets/menu_widgets/msg_queue_icon_outline.png
/assets/menu_widgets/msg_queue_icon_rect.png
/assets/xmb/monochrome/png/default.png
/assets/xmb/monochrome/png/default-content.png
/assets/xmb/monochrome/png/achievement-list.png
/assets/xmb/monochrome/png/add-favorite.png
/assets/xmb/monochrome/png/add.png
/assets/xmb/monochrome/png/arrow.png
/assets/xmb/monochrome/png/battery-20.png
/assets/xmb/monochrome/png/battery-40.png
/assets/xmb/monochrome/png/battery-60.png
/assets/xmb/monochrome/png/battery-80.png
/assets/xmb/monochrome/png/battery-charging.png
/assets/xmb/monochrome/png/battery-full.png
/assets/xmb/monochrome/png/bluetooth.png
/assets/xmb/monochrome/png/clock.png
/assets/xmb/monochrome/png/close.png
/assets/xmb/monochrome/png/core-cheat-options.png
/assets/xmb/monochrome/png/core-disk-options.png
/assets/xmb/monochrome/png/core-infos.png
/assets/xmb/monochrome/png/core-input-remapping-options.png
/assets/xmb/monochrome/png/core-options.png
/assets/xmb/monochrome/png/core-shader-options.png
/assets/xmb/monochrome/png/core.png
/assets/xmb/monochrome/png/cursor.png
/assets/xmb/monochrome/png/database.png
/assets/xmb/monochrome/png/dialog-slice.png
/assets/xmb/monochrome/png/disc.png
/assets/xmb/monochrome/png/favorites-content.png
/assets/xmb/monochrome/png/favorites.png
/assets/xmb/monochrome/png/file.png
/assets/xmb/monochrome/png/folder.png
/assets/xmb/monochrome/png/history.png
/assets/xmb/monochrome/png/image.png
/assets/xmb/monochrome/png/input_ADC.png
/assets/xmb/monochrome/png/input_BIND_ALL.png
/assets/xmb/monochrome/png/input_BTN-D.png
/assets/xmb/monochrome/png/input_BTN-L.png
/assets/xmb/monochrome/png/input_BTN-R.png
/assets/xmb/monochrome/png/input_BTN-U.png
/assets/xmb/monochrome/png/input_DPAD-D.png
/assets/xmb/monochrome/png/input_DPAD-L.png
/assets/xmb/monochrome/png/input_DPAD-R.png
/assets/xmb/monochrome/png/input_DPAD-U.png
/assets/xmb/monochrome/png/input_LB.png
/assets/xmb/monochrome/png/input_LGUN.png
/assets/xmb/monochrome/png/input_LT.png
/assets/xmb/monochrome/png/input_MOUSE.png
/assets/xmb/monochrome/png/input_RB.png
/assets/xmb/monochrome/png/input_RT.png
/assets/xmb/monochrome/png/input_SELECT.png
/assets/xmb/monochrome/png/input_START.png
/assets/xmb/monochrome/png/input_STCK-D.png
/assets/xmb/monochrome/png/input_STCK-L.png
/assets/xmb/monochrome/png/input_STCK-P.png
/assets/xmb/monochrome/png/input_STCK-R.png
/assets/xmb/monochrome/png/input_STCK-U.png
/assets/xmb/monochrome/png/input_TURBO.png
/assets/xmb/monochrome/png/key-hover.png
/assets/xmb/monochrome/png/key.png
/assets/xmb/monochrome/png/Libretro - Pad.png
/assets/xmb/monochrome/png/loadstate.png
/assets/xmb/monochrome/png/menu_achievements.png
/assets/xmb/monochrome/png/menu_add.png
/assets/xmb/monochrome/png/menu_apply_cog.png
/assets/xmb/monochrome/png/menu_apply_toggle.png
/assets/xmb/monochrome/png/menu_audio.png
/assets/xmb/monochrome/png/menu_brightness.png
/assets/xmb/monochrome/png/menu_check.png
/assets/xmb/monochrome/png/menu_drivers.png
/assets/xmb/monochrome/png/menu_exit.png
/assets/xmb/monochrome/png/menu_frameskip.png
/assets/xmb/monochrome/png/menu_help.png
/assets/xmb/monochrome/png/menu_info.png
/assets/xmb/monochrome/png/menu_latency.png
/assets/xmb/monochrome/png/menu_log.png
/assets/xmb/monochrome/png/menu_mixer.png
/assets/xmb/monochrome/png/menu_network.png
/assets/xmb/monochrome/png/menu_notifications.png
/assets/xmb/monochrome/png/menu_osd.png
/assets/xmb/monochrome/png/menu_overlay.png
/assets/xmb/monochrome/png/menu_override.png
/assets/xmb/monochrome/png/menu_pause.png
/assets/xmb/monochrome/png/menu_playlist.png
/assets/xmb/monochrome/png/menu_power.png
/assets/xmb/monochrome/png/menu_privacy.png
/assets/xmb/monochrome/png/menu_quickmenu.png
/assets/xmb/monochrome/png/menu_record.png
/assets/xmb/monochrome/png/menu_rewind.png
/assets/xmb/monochrome/png/menu_saving.png
/assets/xmb/monochrome/png/menu_shutdown.png
/assets/xmb/monochrome/png/menu_stream.png
/assets/xmb/monochrome/png/menu_ui.png
/assets/xmb/monochrome/png/menu_updater.png
/assets/xmb/monochrome/png/menu_user.png
/assets/xmb/monochrome/png/menu_video.png
/assets/xmb/monochrome/png/movie.png
/assets/xmb/monochrome/png/music.png
/assets/xmb/monochrome/png/musics.png
/assets/xmb/monochrome/png/off.png
/assets/xmb/monochrome/png/on.png
/assets/xmb/monochrome/png/pointer.png
/assets/xmb/monochrome/png/reload.png
/assets/xmb/monochrome/png/rename.png
/assets/xmb/monochrome/png/resume.png
/assets/xmb/monochrome/png/retroarch.png
/assets/xmb/monochrome/png/run.png
/assets/xmb/monochrome/png/savestate.png
/assets/xmb/monochrome/png/screenshot.png
/assets/xmb/monochrome/png/setting.png
/assets/xmb/monochrome/png/settings.png
/assets/xmb/monochrome/png/subsetting.png
/assets/xmb/monochrome/png/undo.png
/assets/xmb/monochrome/png/wifi.png
/assets/xmb/monochrome/png/zip.png
/shaders/retroarch.glslp
/shaders/shaders_glsl/bilinear.glslp
/shaders/shaders_glsl/nearest.glslp
/shaders/shaders_glsl/stock.glsl
/shaders/shaders_glsl/anti-aliasing/aa-shader-4.0-level2.glslp
/shaders/shaders_glsl/anti-aliasing/aa-shader-4.0.glslp
/shaders/shaders_glsl/anti-aliasing/advanced-aa.glslp
/shaders/shaders_glsl/anti-aliasing/fxaa.glslp
/shaders/shaders_glsl/anti-aliasing/reverse-aa.glslp
/shaders/shaders_glsl/anti-aliasing/shaders/aa-shader-4.0.glsl
/shaders/shaders_glsl/anti-aliasing/shaders/advanced-aa.glsl
/shaders/shaders_glsl/anti-aliasing/shaders/ewa_curvature.glsl
/shaders/shaders_glsl/anti-aliasing/shaders/fxaa.glsl
/shaders/shaders_glsl/anti-aliasing/shaders/reverse-aa.glsl
/shaders/shaders_glsl/anti-aliasing/shaders/aa-shader-4.0-level2/aa-shader-4.0-level2-pass1-noblend.glsl
/shaders/shaders_glsl/anti-aliasing/shaders/aa-shader-4.0-level2/aa-shader-4.0-level2-pass1.glsl
/shaders/shaders_glsl/anti-aliasing/shaders/aa-shader-4.0-level2/aa-shader-4.0-level2-pass2.glsl
/shaders/shaders_glsl/anti-aliasing/shaders/reverse-aa-post3x/reverse-aa-post3x-pass0.glsl
/shaders/shaders_glsl/anti-aliasing/shaders/reverse-aa-post3x/reverse-aa-post3x-pass1.glsl
/shaders/shaders_glsl/crt/crt-aperture.glslp
/shaders/shaders_glsl/crt/crt-caligari.glslp
/shaders/shaders_glsl/crt/crt-cgwg-fast.glslp
/shaders/shaders_glsl/crt/crt-easymode-halation.glslp
/shaders/shaders_glsl/crt/crt-easymode.glslp
/shaders/shaders_glsl/crt/crt-geom.glslp
/shaders/shaders_glsl/crt/crt-hyllian-3d.glslp
/shaders/shaders_glsl/crt/crt-hyllian-glow.glslp
/shaders/shaders_glsl/crt/crt-hyllian-multipass.glslp
/shaders/shaders_glsl/crt/crt-hyllian.glslp
/shaders/shaders_glsl/crt/crt-interlaced-halation.glslp
/shaders/shaders_glsl/crt/crt-lottes-fast.glslp
/shaders/shaders_glsl/crt/crt-lottes-multipass.glslp
/shaders/shaders_glsl/crt/crt-lottes.glslp
/shaders/shaders_glsl/crt/crt-mattias.glslp
/shaders/shaders_glsl/crt/crt-nes-mini.glslp
/shaders/shaders_glsl/crt/crt-pi-vertical.glslp
/shaders/shaders_glsl/crt/crt-pi.glslp
/shaders/shaders_glsl/crt/crtglow_gauss.glslp
/shaders/shaders_glsl/crt/crtglow_gauss_ntsc_3phase.glslp
/shaders/shaders_glsl/crt/crtglow_lanczos.glslp
/shaders/shaders_glsl/crt/shaders/crt-aperture.glsl
/shaders/shaders_glsl/crt/shaders/crt-caligari.glsl
/shaders/shaders_glsl/crt/shaders/crt-cgwg-fast.glsl
/shaders/shaders_glsl/crt/shaders/crt-easymode.glsl
/shaders/shaders_glsl/crt/shaders/crt-geom.glsl
/shaders/shaders_glsl/crt/shaders/crt-hyllian-3d.glsl
/shaders/shaders_glsl/crt/shaders/crt-hyllian.glsl
/shaders/shaders_glsl/crt/shaders/crt-lottes-fast.glsl
/shaders/shaders_glsl/crt/shaders/crt-lottes.glsl
/shaders/shaders_glsl/crt/shaders/crt-mattias.glsl
/shaders/shaders_glsl/crt/shaders/crt-nes-mini.glsl
/shaders/shaders_glsl/crt/shaders/crt-pi-vertical.glsl
/shaders/shaders_glsl/crt/shaders/crt-pi.glsl
/shaders/shaders_glsl/crt/shaders/crt-easymode-halation/blur_horiz.glsl
/shaders/shaders_glsl/crt/shaders/crt-easymode-halation/blur_vert.glsl
/shaders/shaders_glsl/crt/shaders/crt-easymode-halation/crt-easymode-halation.glsl
/shaders/shaders_glsl/crt/shaders/crt-easymode-halation/linearize.glsl
/shaders/shaders_glsl/crt/shaders/crt-easymode-halation/threshold.glsl
/shaders/shaders_glsl/crt/shaders/crt-hyllian-glow/crt-hyllian.glsl
/shaders/shaders_glsl/crt/shaders/crt-hyllian-glow/resolve2.glsl
/shaders/shaders_glsl/crt/shaders/crt-hyllian-multipass/crt-hyllian-pass0.glsl
/shaders/shaders_glsl/crt/shaders/crt-hyllian-multipass/crt-hyllian-pass1.glsl
/shaders/shaders_glsl/crt/shaders/crt-interlaced-halation/crt-interlaced-halation-pass0.glsl
/shaders/shaders_glsl/crt/shaders/crt-interlaced-halation/crt-interlaced-halation-pass1.glsl
/shaders/shaders_glsl/crt/shaders/crt-interlaced-halation/crt-interlaced-halation-pass2.glsl
/shaders/shaders_glsl/crt/shaders/crt-lottes-multipass/bloompass.glsl
/shaders/shaders_glsl/crt/shaders/crt-lottes-multipass/scanpass.glsl
/shaders/shaders_glsl/crt/shaders/glow/blur_horiz.glsl
/shaders/shaders_glsl/crt/shaders/glow/blur_vert.glsl
/shaders/shaders_glsl/crt/shaders/glow/gauss_horiz.glsl
/shaders/shaders_glsl/crt/shaders/glow/gauss_vert.glsl
/shaders/shaders_glsl/crt/shaders/glow/lanczos_horiz.glsl
/shaders/shaders_glsl/crt/shaders/glow/linearize.glsl
/shaders/shaders_glsl/crt/shaders/glow/resolve.glsl
/shaders/shaders_glsl/crt/shaders/glow/threshold.glsl
/shaders/shaders_glsl/cubic/bicubic.glslp
/shaders/shaders_glsl/cubic/cubic-gamma-correct.glslp
/shaders/shaders_glsl/cubic/cubic.glslp
/shaders/shaders_glsl/cubic/shaders/bicubic.glsl
/shaders/shaders_glsl/cubic/shaders/cubic-gamma-correct.glsl
/shaders/shaders_glsl/cubic/shaders/cubic.glsl
/shaders/shaders_glsl/cubic/shaders/linearize.glsl
/shaders/shaders_glsl/eagle/super-eagle.glslp
/shaders/shaders_glsl/eagle/shaders/supereagle.glsl
/shaders/shaders_glsl/interpolation/aann.glslp
/shaders/shaders_glsl/interpolation/bandlimit-pixel.glslp
/shaders/shaders_glsl/interpolation/controlled_sharpness.glslp
/shaders/shaders_glsl/interpolation/pixellate.glslp
/shaders/shaders_glsl/interpolation/quilez.glslp
/shaders/shaders_glsl/interpolation/sharp-bilinear-2x-prescale.glslp
/shaders/shaders_glsl/interpolation/sharp-bilinear-scanlines.glslp
/shaders/shaders_glsl/interpolation/sharp-bilinear-simple.glslp
/shaders/shaders_glsl/interpolation/sharp-bilinear.glslp
/shaders/shaders_glsl/interpolation/smootheststep.glslp
/shaders/shaders_glsl/interpolation/smuberstep.glslp
/shaders/shaders_glsl/interpolation/shaders/aann.glsl
/shaders/shaders_glsl/interpolation/shaders/bandlimit-pixel.glsl
/shaders/shaders_glsl/interpolation/shaders/ControlledSharpness.glsl
/shaders/shaders_glsl/interpolation/shaders/pixellate.glsl
/shaders/shaders_glsl/interpolation/shaders/quilez.glsl
/shaders/shaders_glsl/interpolation/shaders/sharp-bilinear-scanlines.glsl
/shaders/shaders_glsl/interpolation/shaders/sharp-bilinear-simple.glsl
/shaders/shaders_glsl/interpolation/shaders/sharp-bilinear.glsl
/shaders/shaders_glsl/interpolation/shaders/smootheststep.glsl
/shaders/shaders_glsl/interpolation/shaders/smuberstep.glsl
/shaders/shaders_glsl/scalefx/scalefx+rAA.glslp
/shaders/shaders_glsl/scalefx/scalefx-hybrid.glslp
/shaders/shaders_glsl/scalefx/scalefx.glslp
/shaders/shaders_glsl/scalefx/shaders/scalefx-pass0.glsl
/shaders/shaders_glsl/scalefx/shaders/scalefx-pass1.glsl
/shaders/shaders_glsl/scalefx/shaders/scalefx-pass2.glsl
/shaders/shaders_glsl/scalefx/shaders/scalefx-pass3.glsl
/shaders/shaders_glsl/scalefx/shaders/scalefx-pass4-hybrid.glsl
/shaders/shaders_glsl/scalefx/shaders/scalefx-pass4.glsl
/shaders/shaders_glsl/scalehq/2xScaleHQ.glslp
/shaders/shaders_glsl/scalehq/4xScaleHQ.glslp
/shaders/shaders_glsl/scalehq/shaders/2xScaleHQ.glsl
/shaders/shaders_glsl/scalehq/shaders/4xScaleHQ.glsl
/shaders/shaders_glsl/xbrz/4xbrz-linear.glslp
/shaders/shaders_glsl/xbrz/5xbrz-linear.glslp
/shaders/shaders_glsl/xbrz/6xbrz-linear.glslp
/shaders/shaders_glsl/xbrz/xbrz-freescale-multipass.glslp
/shaders/shaders_glsl/xbrz/xbrz-freescale.glslp
/shaders/shaders_glsl/xbrz/shaders/4xbrz.glsl
/shaders/shaders_glsl/xbrz/shaders/5xbrz.glsl
/shaders/shaders_glsl/xbrz/shaders/6xbrz.glsl
/shaders/shaders_glsl/xbrz/shaders/xbrz-freescale.glsl
/shaders/shaders_glsl/xbrz/shaders/xbrz-freescale-multipass/xbrz-freescale-pass0.glsl
/shaders/shaders_glsl/xbrz/shaders/xbrz-freescale-multipass/xbrz-freescale-pass1.glsl`;
		var splitData = data2.split(",,,\n");
		fsBundleDirs = JSON.parse(splitData[0]);
		fsBundleFiles = splitData[1].split("\n");

		// make the paths
		FS.createPath("/", baseFsBundleDir.substring(1), true, true);
		for (var i = 0; i < fsBundleDirs.length; i++) {
			FS.createPath(baseFsBundleDir + fsBundleDirs[i][0], fsBundleDirs[i][1], true, true);
		}

		loadingBar.style.display = "initial";
		loadingBar.value = 0;
		let step = 1 / fsBundleFiles.length;
		let num = 0;

		// setup files for injecting
		xmbDefaultFiles = loadEncodedFS(encodedXmbDefaultFiles);
		console.log("prepared xmbDefaultFiles array")

		cheatFiles = loadEncodedFS(encodedCheatFiles);
		console.log("prepared cheatFiles array")

		FS.createPath("/", baseFsCheatsDir, true, true);
		for (fileName in cheatFiles) {
			FS.writeFile(baseFsCheatsDir + fileName, cheatFiles[fileName]);
			console.log("Cheat File wrote to cheats dir: " + baseFsCheatsDir + fileName)
		}

		// make the files and write from non cdn fuck you binbashbananna why the hell would you use a cdn for this bullshit
		for (let i = 0; i < fsBundleFiles.length; i++) {
			filename = fsBundleFiles[i].split("/")[fsBundleFiles[i].split("/").length - 1]
			if (filename in xmbDefaultFiles) {
				FS.writeFile(baseFsBundleDir + fsBundleFiles[i], xmbDefaultFiles[filename]);
				console.log("Caught file and wrote to fs: " + baseFsBundleDir + fsBundleFiles[i])
				loadingBar.value += step;
				if (++num == fsBundleFiles.length) donePreparingBundle(performance.now() - bundleSTime);
			} else {
				grab(bundleCdn + "bundle" + fsBundleFiles[i], "arraybuffer", function (data) {
					FS.writeFile(baseFsBundleDir + fsBundleFiles[i], new Uint8Array(data));
					loadingBar.value += step;
					if (++num == fsBundleFiles.length) donePreparingBundle(performance.now() - bundleSTime);
				}, function () {
					bundleErrors++;
					loadingBar.value += step;
					if (++num == fsBundleFiles.length) donePreparingBundle(performance.now() - bundleSTime);
				});
			}
		}
	} catch (e) {
		console.warn(e);
		log("Failed to get asset bundle, skipping");
		bundleReady = true;
		removeStatus("Getting assets");
	}
	// }, function () {
	// 	log("Failed to get asset bundle, skipping");
	// 	bundleReady = true;
	// 	removeStatus("Getting assets");
	// });
}

// write cheats files here

function donePreparingBundle(tooktime) {
	loadingBar.style.display = "none";
	// extraConfig += 'menu_minimal_assets = "true"\n';
	bundleReady = true;
	removeStatus("Getting assets");
	log("Finished bundle fetch in " + (tooktime / 1000).toFixed(1) + " seconds, " + bundleErrors + " errors");
}

// prepare FS with BIOSes
function prepareBios() {
	if (bioses[core]) {
		let bios = bioses[core];
		let num = 0;

		FS.createPath("/", baseFsSystemDir.substring(1) + bios.path, true, true);
		for (let i = 0; i < bios.files.length; i++) {
			grab(biosCdn + bios.files[i], "arraybuffer", function (data) {
				FS.writeFile(baseFsSystemDir + bios.path + bios.files[i], new Uint8Array(data));
				log("BIOS fetch: Success " + bios.files[i]);
				if (++num == bios.files.length) biosReady = true;
			}, function () {
				log("BIOS fetch: Failed " + bios.files[i]);
				if (++num == bios.files.length) biosReady = true;
			});
		}
	} else {
		biosReady = true;
	}
}

// tell the user to not rename the rom
function doNotRename() {
	if (romMode == "upload" && !localStorage.getItem("webretro_settings_pastFirstSave")) {
		alert("WARNING: Do not rename your ROM file after this! The save data is specific to the ROM file name!");
		localStorage.setItem("webretro_settings_pastFirstSave", "true");
	}
}

// converting save lists
function saveArrToObj(arr) {
	let obj = {};
	for (var i = 0; i < arr.length; i++) {
		obj[arr[i].dir + "ROMNAME" + arr[i].ext] = arr[i].data;
	}
	return obj;
}

function saveObjToArr(obj) {
	return Object.entries(obj).map(i => ({
		ext: i[0].split("ROMNAME")[1],
		dir: i[0].split("ROMNAME")[0],
		data: i[1]
	}));
}

function saveArrToFiles(arr) {
	let files = [];
	for (var i = 0; i < arr.length; i++) {
		files.push({
			path: arr[i].dir + "ROMNAME" + arr[i].ext,
			data: arr[i].data.buffer
		});
	}
	return files;
}

function saveFilesToArr(files) {
	let arr = [];
	for (var i = 0; i < files.length; i++) {
		arr.push({
			ext: files[i].path.split("ROMNAME")[1],
			dir: files[i].path.split("ROMNAME")[0],
			data: new Uint8Array(files[i].data)
		});
	}
	return arr;
}

// save game
function saveSRAMHandler(path) {
	saveObj[path.replace(baseFsSaveDir, "").replace("rom", "ROMNAME")] = FS.readFile(path);
	setIdbItem("RetroArch_saves_" + romName, saveObjToArr(saveObj));

	new sideAlert("Saved", 3000);

	doNotRename();
}

// save state
function saveStateHandler() {
	if (FS.analyzePath("/home/web_user/retroarch/userdata/states/rom.state").exists) {
		setIdbItem("RetroArch_states_" + romName, FS.readFile("/home/web_user/retroarch/userdata/states/rom.state"));

		doNotRename();
	} else {
		new sideAlert("There was an error saving state. Please try again.", 5000);
	}
}

// autosaving
function autosaveSRAM() {
	if (autosave.checked && !document.hidden && !isPaused) {
		new sideAlert("Autosaving...", 3000);
		Module._cmd_savefiles();
	}
	window.setTimeout(function () {
		autosaveSRAM();
	}, 300000);
}

// writeToFile router
function writeToFileHandler(path) {
	// console.log("%c" + path, "color: #8888ff");

	if (path.startsWith(baseFsSaveDir)) {
		saveSRAMHandler(path);
	} else if (path.startsWith("/home/web_user/retroarch/userdata/states/")) {
		if (path == "/home/web_user/retroarch/userdata/states/rom.state") saveStateHandler();
	}
}


// poststartup
// runs after emulator starts
function afterStart() {
	mainCompleted = true;

	adjustCanvasSize();

	adjustMenuHeight();
	// menuBar.classList.add("show");
	Module._cmd_toggle_menu();

	// functions for save and state buttons

	// states

	saveState.classList.remove("disabled");
	saveState.onclick = function () {
		Module._cmd_save_state();
	}

	importState.classList.remove("disabled");
	importState.onclick = function () {
		if (noStateCores.includes(core)) {
			alert("Core does not support save states.");
		} else {
			uploadFile(".bin, .state", function (file) {
				setIdbItem("RetroArch_states_" + romName, new Uint8Array(file.data));
				FS.writeFile("/home/web_user/retroarch/userdata/states/rom.state", new Uint8Array(file.data));
				new sideAlert("Imported state (press load state)", 3000);
			});
		}
	}

	loadState.classList.remove("disabled");
	loadState.onclick = function () {
		Module._cmd_load_state();
	}

	exportState.classList.remove("disabled");
	exportState.onclick = function () {
		if (FS.analyzePath("/home/web_user/retroarch/userdata/states/rom.state").exists) {
			downloadFile(FS.readFile("/home/web_user/retroarch/userdata/states/rom.state"), "game-state-" + romName + "-" + getTime() + ".state");
		} else {
			alert("No state to export.");
		}
	}

	undoSaveState.classList.remove("disabled");
	undoSaveState.onclick = function () {
		Module._cmd_undo_save_state();
	}

	undoLoadState.classList.remove("disabled");
	undoLoadState.onclick = function () {
		Module._cmd_undo_load_state();
	}

	// saves

	saveGame.classList.remove("disabled");
	saveGame.onclick = function () {
		new sideAlert("Saving...", 3000);
		Module._cmd_savefiles();
	}

	importSave.classList.remove("disabled");
	importSave.onclick = function () {
		if (noSaveCores.includes(core)) {
			alert("Core does not support SRAM.");
		} else {
			function done() {
				if (confirm("Save imported. Reloading now for changes to take effect.")) {
					autosave.checked = false;
					window.onbeforeunload = function () {}
					window.location.reload();
				}
			}
			if (multiSaveCores.includes(core)) {
				uploadFileMulti(".zip, .bin, " + sramExts, function (files) {
					if (files.length == 1) {
						if (files[0].path.split(".").slice(-1)[0].toLowerCase() == "zip") {
							unzipFileMulti(files[0].data, function (uzfiles) {
								setIdbItem("RetroArch_saves_" + romName, saveFilesToArr(replaceInFiles(uzfiles, romName, "ROMNAME")));
								done();
							}, function () {
								alert("Zip File is empty");
							});
						} else {
							setIdbItem("RetroArch_saves_" + romName, [{
								ext: "." + files[0].path.split(".").slice(-1)[0],
								dir: "",
								data: new Uint8Array(file.data)
							}]);
							done();
						}
					} else {
						setIdbItem("RetroArch_saves_" + romName, saveFilesToArr(replaceInFiles(files, romName, "ROMNAME")));
						done();
					}
				});
			} else {
				uploadFile(".bin, " + sramExts, function (file) {
					setIdbItem("RetroArch_saves_" + romName, [{
						ext: "." + file.name.split(".").slice(-1)[0],
						dir: "",
						data: new Uint8Array(file.data)
					}]);
					done();
				});
			}
		}
	}

	exportSave.classList.remove("disabled");
	exportSave.onclick = function () {
		var files = replaceInFiles(saveArrToFiles(saveObjToArr(saveObj)), "ROMNAME", romName);
		if (!files.length) {
			alert("No save to export.");
		} else if (files.length == 1) {
			downloadFile(files[0].data, "game-sram-" + romName + "-" + getTime() + "." + files[0].path.split(".").slice(1).join("."));
		} else {
			zipFiles(files, function (zd) {
				downloadFile(zd, "game-sram-" + romName + "-" + getTime() + ".zip", "application/zip");
			});
		}
	}

	// start autosave loop
	autosave.removeAttribute("disabled");
	autosave.parentElement.parentElement.classList.remove("disabled");
	window.setTimeout(function () {
		autosaveSRAM();
	}, 300000);

	// toggle between sharp and smooth canvas graphics
	smooth.removeAttribute("disabled");
	smooth.parentElement.parentElement.classList.remove("disabled");
	smooth.onclick = function () {
		if (this.checked) {
			canvas.className = "textureSmooth";
		} else {
			canvas.className = "texturePixelated";
		}
	}

	// pause and resume
	pause.classList.remove("disabled");
	pause.onclick = function () {
		if (this.textContent.trim() == "Pause") {
			Module.pauseMainLoop();
			isPaused = true;
			this.textContent = "Resume";
			document.body.classList.add("paused");
		} else {
			Module.resumeMainLoop();
			isPaused = false;
			this.textContent = "Pause";
			document.body.classList.remove("paused");
		}
	}
	resumeOverlay.onclick = function () {
		pause.click();
	}

	// toggle menu
	menuButton.classList.remove("disabled");
	menuButton.onclick = function () {
		Module._cmd_toggle_menu();
	}

	// reset
	resetButton.classList.remove("disabled");
	resetButton.onclick = function () {
		Module._cmd_reset();
	}
	resetButton2.classList.remove("disabled");
	resetButton2.onclick = function () {
		Module._cmd_reset();
	}

	// toggle mouse grab
	mouseGrabButton.classList.remove("disabled");
	mouseGrabButton.onclick = function (e) {
		e.target.parentElement.style.display = "none";
		Module._cmd_toggle_grab_mouse();
		window.setTimeout(function () {
			canvas.focus();
			canvas.requestPointerLock();
			e.target.parentElement.style.display = "";
		}, 20);
	}

	// toggle game focus
	gameFocusButton.classList.remove("disabled");
	gameFocusButton.onclick = function (e) {
		e.target.parentElement.style.display = "none";
		Module._cmd_toggle_game_focus();
		window.setTimeout(function () {
			canvas.focus();
			canvas.requestPointerLock();
			e.target.parentElement.style.display = "";
		}, 20);
	}

	// screenshot button
	takeScreenshot.classList.remove("disabled");
	takeScreenshot.onclick = function () {
		Module._cmd_take_screenshot();
	}

	// ctrl+v inside canvas
	document.addEventListener("keydown", function (e) {
		if (e.ctrlKey && e.code == "KeyV") {
			fakeKeyPress({
				code: "Backspace"
			});
			navigator.clipboard.readText().then(function (text) {
				sendText(text);
			});
		}
	}, false);
}

// start
function initFromData(data) {
	window.onbeforeunload = function () {
		return true;
	}
	async function waitForReady() {
		if (wasmReady && bundleReady && biosReady) {
			setStatus("Waiting for emulator");
			log(data.length == 1 ? "Initializing with " + bytesToHumanReadable(data[0].data.byteLength) + " of data" : "Initializing with multiple files");
			canvas.addEventListener("contextmenu", function (e) {
				e.preventDefault();
			}, false);
			adjustCanvasSize();

			// prevent defaults for key presses
			document.addEventListener("keydown", function (e) {
				if (pdKeys.includes(e.which)) e.preventDefault();
			}, false);

			// fix for iframe bug
			if (window.self != window.top) {
				canvas.addEventListener("mousedown", function () {
					window.focus();
				}, false);
				if (!queries.hasOwnProperty("noautorefocus")) {
					window.addEventListener("blur", function (e) {
						window.setTimeout(function () {
							window.focus();
						}, 0);
					}, false);
				}
			}

			// create the rom(s) in the filesystem
			if (data.length == 1) {
				// single-rom mode

				realRomExt = data[0].path.split(".").slice(-1)[0] || "bin";
				FS.createPath("/", "rom", true, true);
				FS.writeFile("/rom/rom." + realRomExt, new Uint8Array(data[0].data));
				Module.arguments[0] = "/rom/rom." + realRomExt;
			} else {
				// multi-rom mode

				var masterIndex = await getMasterRom(data);

				// now set the romName for multi-file roms
				romName = data[masterIndex].path.split("/").slice(-1)[0].split(".")[0];
				document.title = romName + (appIsPwa ? "" : " | webretro");

				realRomExt = data[masterIndex].path.split(".").slice(-1)[0] || "bin";
				data[masterIndex].path = "rom." + realRomExt;
				Module.arguments[0] = "/rom/" + data[masterIndex].path;

				// optionally rename any direct dependencies to "rom"
				if (exclusiveMultiFileCores.includes(core) && confirm('Rename similar files? (Use if you get "Unable to find rom" errors. Otherwise don\'t use.)')) {
					for (var i = 0; i < data.length; i++) {
						if (!data[i].path.includes("/")) data[i].path = data[i].path.replace(romName, "rom");
					}
				}

				FS.createPath("/", "rom", true, true);
				var parentDirs = Array.from(new Set(data.map(i => i.path.split("/").slice(0, -1).join("/")))).filter(i => i);

				// create directories
				for (var i = 0; i < parentDirs.length; i++) {
					FS.createPath("/rom/", parentDirs[i], true, true);
				}

				// create files
				for (var i = 0; i < data.length; i++) {
					FS.writeFile("/rom/" + data[i].path, new Uint8Array(data[i].data));
				}
			}

			// load save
			var cSave = await getIdbItem("RetroArch_saves_" + romName);
			if (cSave) {
				saveObj = saveArrToObj(cSave);
				FS.createPath("/", baseFsSaveDir.substring(1), true, true);
				for (var i = 0; i < cSave.length; i++) {
					safeWriteFile(baseFsSaveDir + cSave[i].dir + "rom" + cSave[i].ext, cSave[i].data);
				}
				new sideAlert("Save loaded for " + romName, 5000);
				log("Save loaded for " + romName);
			}

			// import state
			var cState = await getIdbItem("RetroArch_states_" + romName);
			if (cState) {
				FS.createPath("/", "home/web_user/retroarch/userdata/states", true, true);
				FS.writeFile("/home/web_user/retroarch/userdata/states/rom.state", cState);
				new sideAlert("State imported for " + romName + " (press load state)", 5000);
				log("State imported for " + romName);
			}

			// config
			editedConfig = nulKeys + configObjToStr(savedKeybindsObj) + extraConfig + 'menu_driver = "xmb"'
			safeWriteFile("/home/web_user/retroarch/userdata/retroarch.cfg", editedConfig);
			console.log("Loaded config.")

			// get the core options
			var coreOptionsString = "";
			if (coreOptions[core]) {
				pso.style.display = "none";
				try {
					var opts = pso.querySelectorAll("[data-core=" + core + "] input");
					for (var i = 0; i < opts.length; i++) {
						if (opts[i].checked && coreOptions[core][opts[i].dataset.opt]) coreOptionsString += coreOptions[core][opts[i].dataset.opt];
					}
				} catch (e) {
					console.warn(e);
				}
			}

			// core-specific config (will be revised in the future)
			switch (core) {
				case "a5200":
					safeWriteFile(baseFsConfigDir + "a5200/a5200.opt", coreOptionsString);
					break;
				case "mednafen_psx":
					safeWriteFile(baseFsConfigDir + "Beetle PSX/Beetle PSX.opt", coreOptionsString);
					break;
				case "mednafen_psx_hw":
					safeWriteFile(baseFsConfigDir + "Beetle PSX HW/Beetle PSX HW.opt", coreOptionsString);
					break;
				case "mednafen_vb":
					safeWriteFile(baseFsConfigDir + "Beetle VB/Beetle VB.opt", coreOptionsString);
					break;
				case "mednafen_wswan":
					safeWriteFile(baseFsConfigDir + "Beetle WonderSwan/Beetle WonderSwan.opt", coreOptionsString);
					break;
				case "melonds":
					safeWriteFile(baseFsConfigDir + "melonDS/melonDS.opt", coreOptionsString + 'melonds_touch_mode = "Touch"\n');
					break;
				case "mgba":
					safeWriteFile(baseFsConfigDir + "mGBA/mGBA.opt", coreOptionsString);
					break;
				case "mupen64plusNext":
					safeWriteFile(baseFsConfigDir + "Mupen64Plus-Next/Mupen64Plus-Next.opt", coreOptionsString + 'mupen64plus-ThreadedRenderer = "False"\nmupen64plus-EnableCopyColorToRDRAM = "Off"\nmupen64plus-EnableCopyDepthToRDRAM = "Off"\n');
					break;
				case "o2em":
					safeWriteFile(baseFsConfigDir + "O2EM/O2EM.opt", coreOptionsString);
					break;
				case "parallel_n64":
					safeWriteFile(baseFsConfigDir + "ParaLLEl N64/ParaLLEl N64.opt", coreOptionsString);
					break;
				case "prosystem":
					safeWriteFile(baseFsConfigDir + "ProSystem/ProSystem.opt", coreOptionsString);
					break;
				case "snes9x": // actually a remap
					safeWriteFile(baseFsConfigDir + "remaps/Snes9x/Snes9x.rmp", coreOptionsString);
					break;
				case "stella2014":
					safeWriteFile(baseFsConfigDir + "Stella 2014/Stella 2014.opt", coreOptionsString);
					break;
				case "vecx":
					safeWriteFile(baseFsConfigDir + "VecX/VecX.opt", coreOptionsString);
					break;
				case "virtualjaguar":
					safeWriteFile(baseFsConfigDir + "Virtual Jaguar/Virtual Jaguar.opt", coreOptionsString + 'virtualjaguar_bios = "enabled"\n');
					break;
				case "yabause":
					safeWriteFile(baseFsConfigDir + "Yabause/Yabause.opt", coreOptionsString);
					break;
			}

			// system-specific config
			switch (systems[core]) {
				case "SNES":
					var hash = md5(u8atoutf8(new Uint8Array(data[0].data)));
					if (smasBrickFix.hasOwnProperty(hash)) {
						FS.writeFile("/rom/rom.ips", new Uint8Array(smasBrickFix[hash]));
						new sideAlert("SMAS Bricks Fixed!", 5000);
					}
					break;
			}

			// writeToFile tracking (needs some extra stuff since it frequently fires in groups)
			FS.trackingDelegate.onWriteToFile = function (path) {
				if (!path.startsWith("/dev/")) {
					if (writeToFileCooldown[path]) window.clearTimeout(writeToFileCooldown[path]);
					writeToFileCooldown[path] = window.setTimeout(function () {
						delete writeToFileCooldown[path];
						FSTracking.dispatchEvent(new CustomEvent("writeToFile", {
							detail: path
						}));

						// bigger delay = more lenient
					}, 1000);
				}
			}

			FSTracking.addEventListener("writeToFile", function (e) {
				writeToFileHandler(e.detail);
			}, false);

			// start
			log("Calling main...");
			try {
				Module.callMain(Module.arguments);
			} catch (e) {
				var estr = "FAILED TO CALL MAIN. CHECK BROWSER CONSOLE FOR DETAILS. (core: " + core + ")";
				alert(estr);
				log(estr);
				console.error(e);
			}
			log("Main completed...");

			adjustCanvasSize();
			loadingDiv.style.display = "none";

			window.setTimeout(afterStart, 1000);
		} else {
			window.setTimeout(waitForReady, 250);
		}
	}
	waitForReady();
}

var Module = {
	canvas: canvas,
	noInitialRun: true,
	arguments: ["/rom/rom.bin", "--verbose"],
	onRuntimeInitialized: function () {
		wasmReady = true;
		log("WASM ready");

		// fetch BIOSes
		prepareBios();

		// fetch asset bundle
		if (queries.hasOwnProperty("nobundle")) {
			bundleReady = true;
			log("Skipping bundle");
		} else {
			prepareBundle();
		}
	},
	print: function (text) {
		log("stdout: " + text);
	},
	printErr: function (text) {
		log("stderr: " + text);
	}
};