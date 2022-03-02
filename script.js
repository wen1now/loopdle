const START_DAY = 19053;
const CELL_TYPES = 6;
DIR_DICT = function(di,dj){
	if (di==1){
		return 3;
	}
	if (di==-1){
		return 1;
	}
	if (dj==1){
		return 0;
	}
	if (dj==-1){
		return 2;
	}
}
const PIPE_DICT = {
	3: 4,
	5: 0,
	6: 5,
	9: 2,
	10: 1,
	12: 3,
}

const attempts = 5;

const num_cycles = 1072;
const m = 6;
const n = 6;
const data = data_6x6;

var day = Math.floor(Date.now() / 86400000) - START_DAY + 1;

var locked = false;
var game_attempts = 0;
var total_solves = 0;

tmp = new MersenneTwister(day);
board_num = tmp.genrand_int32() % num_cycles;
board = data_6x6[board_num];
counts = new Array(CELL_TYPES).fill(0);
for (var i in board){
	counts[board[i]]++;
}

current_board = 0;
user_boards = [];

s = "";
for (var i=0;i<attempts;i++){
	tmp = [];
	s += `<table id='table${i}'>`;
	for (var j=0;j<n;j++){
		tmp.push(new Array(m).fill(0));
		s += "<tr>";
		for (var k=0;k<m;k++){
			s += `<td id='${i}.${j}.${k}tl' class='topleft' i='${i}' j='${j}' k='${k}'></td>`;
			s += `<td id='${i}.${j}.${k}tr' class='topright' i='${i}' j='${j}' k='${k}'></td>`;
		}
		s += "<tr>";
		s += "<tr>";
		for (var k=0;k<m;k++){
			s += `<td id='${i}.${j}.${k}bl' class='bottomleft' i='${i}' j='${j}' k='${k}'></td>`;
			s += `<td id='${i}.${j}.${k}br' class='bottomright' i='${i}' j='${j}' k='${k}'></td>`;
		}
		s += "<tr>";
	}
	s += "</table>";
	user_boards.push(tmp);
}

place = document.getElementById("boards");
place.innerHTML += s;

var i_, j_, k_, dragging, draw_lines;

function resetDrag(){
	i_ = -1;
	j_ = -1;
	k_ = -1;
	dragging = false;
	draw_lines = false;
	new_line = true;
}

resetDrag();

function begin_draw(i,j,k){
	i_ = i;
	j_ = j;
	k_ = k;
	dragging = true;
	draw_lines = false;
	new_line = true;
}

function draw(i,j,k,dir,adding){
	if (dir == 0){
		s = 'trbbrt';
	}
	if (dir == 1){
		s = 'trltlr';
	}
	if (dir == 2){
		s = 'tlbblt';
	}
	if (dir == 3){
		s = 'blrbrl';
	}
	if (adding){
		document.getElementById(`${i}.${j}.${k}`+s[0]+s[1]).classList.add(s[2]);
		document.getElementById(`${i}.${j}.${k}`+s[3]+s[4]).classList.add(s[5]);
	}
	if (!adding){
		document.getElementById(`${i}.${j}.${k}`+s[0]+s[1]).classList.remove(s[2]);
		document.getElementById(`${i}.${j}.${k}`+s[3]+s[4]).classList.remove(s[5]);
	}
}

function draw_to(i,j,k){
	if (locked)return;
	if (!dragging)return;
	if (i != i_)return;
	if (Math.abs(j-j_)+Math.abs(k-k_) != 1)return;
	if (current_board != i)return;
	dir1 = DIR_DICT(j_-j,k_-k);
	dir2 = DIR_DICT(j-j_,k-k_);
	if (new_line){
		if (user_boards[i][j][k] & (1 << dir1)){
			draw_lines = false;
		} else {
			draw_lines = true;
		}
		new_line = false;
	}
	if (draw_lines){
		user_boards[i][j][k] |= 1 << dir1;
		user_boards[i_][j_][k_] |= 1 << dir2;
		draw(i,j,k,dir1,true);
		draw(i_,j_,k_,dir2,true);
	} else {
		user_boards[i][j][k] &= ~(1 << dir1);
		user_boards[i_][j_][k_] &= ~(1 << dir2);
		draw(i,j,k,dir1,false);
		draw(i_,j_,k_,dir2,false);
	}
	i_ = i;
	j_ = j;
	k_ = k;
	save_to_storage();
}

for (var i=0;i<attempts;i++){
	document.getElementById(`table${i}`).addEventListener('mouseleave', resetDrag);
	document.getElementById(`table${i}`).addEventListener('mouseup', resetDrag);
	for (var j=0;j<n;j++){
		for (var k=0;k<m;k++){
			for (var l=0;l<4;l++){
				z = ['tl','tr','bl','br'][l];
				document.getElementById(`${i}.${j}.${k}`+z).addEventListener('mousemove', function(){
					draw_to(this.getAttribute('i'),this.getAttribute('j'),this.getAttribute('k'));
				})
				document.getElementById(`${i}.${j}.${k}`+z).addEventListener('mousedown', function(){
					begin_draw(this.getAttribute('i'),this.getAttribute('j'),this.getAttribute('k'));
				})
			}
		}
	}
}

function arr_eq(i,j){
	if (i.length != j.length)return false;
	for (var z in i){
		if (i[z] != j[z])return false;
	}
	return true;
}

function check_valid(){
	z = [];
	for (var i = 0; i<m; i++){
		for (var j = 0; j<n; j++){
			if (user_boards[current_board][i][j] in PIPE_DICT){
				z.push(PIPE_DICT[user_boards[current_board][i][j]])
			} else {return false}
		}
	}
	for (var i in data_6x6){
		if (arr_eq(data_6x6[i],z)){
			return z;
		}
	}
	return false;
}

var solve_stats = new Array(attempts+1).fill(0)

function save_to_storage(){
	localStorage.setItem("loopdle", JSON.stringify({
		day_num: day,
		boards: user_boards,
		attempt_no: current_board,
		stats: solve_stats,
		solved: locked,
		game_attempts: game_attempts,
		total_solves: total_solves,
	}));
}

function load_from_storage(){
	if (localStorage.getItem("loopdle") === null)return;
	z = JSON.parse(localStorage.getItem("loopdle"));
	if (z.day_num == day){
		user_boards = z.boards;
		for (var i=0;i<attempts;i++){
			for (var j=0;j<n;j++){
				for (var k=0;k<m;k++){
					p = PIPE_DICT[z.boards[i][j][k]];
					for (var l=0;l<4;l++){
						if (z.boards[i][j][k] & (1<<l)){
							draw(i,j,k,l,true);
						}
						if (i<z.attempt_no){
							if (j!=0 && j!=n-1 && k!=0 && k!=m-1){
								if (p == board[j*m+k]){
									s = ['tl','tr','bl','br'];
									document.getElementById(`${i}.${j}.${k}`+s[l]).classList.add('green');
								}
							} else  {
								s = ['tl','tr','bl','br'];
								document.getElementById(`${i}.${j}.${k}`+s[l]).classList.add('border');
							}
						}
					}
				}
			}
		}
		current_board = z.attempt_no;
		locked = z.solved;
		if (z.solved){
			document.getElementById("congratulations").style.visibility = 'visible';
			document.getElementById("share").style.visibility = 'visible';
			document.getElementById("congratulations").innerHTML = `You got it in ${current_board} attempts!`;
		}
	}
	solve_stats = z.stats;
	game_attempts = z.game_attempts;
	total_solves = z.total_solves;
}

document.getElementById("invalidboard").style.visibility = 'hidden';
document.getElementById("congratulations").style.visibility = 'hidden';
document.getElementById("share").style.visibility = 'hidden';

function check_press(){
	if (locked)return;
	var z = check_valid();
	var correct = 0;
	if (z === false){
		document.getElementById("invalidboard").style.visibility = 'visible';
		setTimeout(function(){document.getElementById("invalidboard").style.visibility = 'hidden';}, 2000)
	} else {
		for (p in z){
			i = current_board;
			j = Math.floor(p/m);
			k = p%m;
			if (j!=0 && j!=n-1 && k!=0 && k!=m-1){
				if (z[p] == board[p]){
					for (l in [0,1,2,3]){
						s = ['tl','tr','bl','br'];
						document.getElementById(`${i}.${j}.${k}`+s[l]).classList.add('green');
					}
					correct += 1
				}
			} else {
				for (l in [0,1,2,3]){
					s = ['tl','tr','bl','br'];
					document.getElementById(`${i}.${j}.${k}`+s[l]).classList.add('border');
				}
			}
		}
		if (current_board == 0){
			game_attempts += 1;
		}
		current_board++;
		if (correct == 16){
			document.getElementById("congratulations").style.visibility = 'visible';
			document.getElementById("share").style.visibility = 'visible';
			document.getElementById("congratulations").innerHTML = `You got it in ${current_board} attempts!`;
			locked = true;
			solve_stats[current_board]++;
			total_solves += 1;
		} else if (current_board == attempts){
			// out of attempts
		}
	}
	save_to_storage();
}

/*  below function from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript  */

// Copies a string to the clipboard. Must be called from within an
// event handler such as click. May return false if it failed, but
// this is not always possible. Browser support for Chrome 43+,
// Firefox 42+, Safari 10+, Edge and Internet Explorer 10+.
// Internet Explorer: The clipboard feature may be disabled by
// an administrator. By default a prompt is shown the first
// time the clipboard is used (per session).
function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return prompt("Copy to clipboard: Ctrl+C, Enter", text);
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

function share(){
	var s = "\n\n"
	var black = "\u2B1B";
	var green = "\uD83D\uDFE9";
	for (var i=0;i<current_board;i++){
		for (var j=1;j<n-1;j++){
			for (var k=1;k<m-1;k++){
				p = PIPE_DICT[z.boards[i][j][k]];
				if (p == board[j*m+k]){
					s += green;
				} else {
					s += black;
				}
			}
			s += '\n';
		}
		s += '\n';
	}
	copyToClipboard(`Loopdle ${day} ${current_board}/${attempts}`+s);
}

function updateTimeLeft(){
	var seconds_left = Math.floor((86400000 * (START_DAY + day) - Date.now())/1000);
	if (seconds_left < 0){
		var s = "A new loopdle is here! Refresh the page.";
	} else {
		var S = seconds_left%60;
		if (S < 10){S = "0" + S}
		seconds_left = Math.floor(seconds_left/60);
		var M = seconds_left%60;
		if (M < 10){S = "0" + M}
		seconds_left = Math.floor(seconds_left/60);
		var H = seconds_left;
		var s = `Time until new loopdle: ${H}:${M}:${S}`;
	}
	document.getElementById("countdown").innerHTML = s;
}

updateTimeLeft();
setInterval(updateTimeLeft,1000);

load_from_storage();
document.getElementById("everything").style.visibility = 'visible';






