function doable_ways(s,k){
    /* in my defense, this function was nice until i remembered s[k] needed to be special cased
     ok, and before i realised (( and )) were things
     */
    if (s.slice(-1) == "2" || (s[k-1] == "(" && s[k] == ")")){
        if (k == s.length-2){
            if (s[k]==".") return [];
            return [s.slice(0,-1)+"2"];
        } 
        return [s.slice(0,-1)+(s[k]=="."?"0":"1")];
    }
    var t;
    if (s[k-1] == ")" && s[k] == "("){
        t = s.slice(0,k-1) + ".." + s.slice(k+1,-1) + "2";
    }
    else if (s[k-1] == "." && s[k] == "."){
        t = s.slice(0,k-1) + "()" + s.slice(k+1,-1) + "1";
    }
    else if (s[k-1] == "."){
        t = s.slice(0,k-1) + s[k] + "." + s.slice(k+1,-1) + "2";
    }
    else if (s[k] == "."){
        t = s.slice(0,k-1) + "." + s[k-1] + s.slice(k+1,-1) + "1";
    }
    else if (s[k-1] == "(" && s[k] == "("){
        let c = 1;
        for (var z = k+1; z<s.length; z++){
            if (s[z] == "("){
                c += 1;
            }
            if (s[z] == ")"){
                c -= 1;
            }
            if (c == 0){
                break;
            }
        }
        t = s.slice(0,k-1) + ".." + s.slice(k+1,z) + "(" + s.slice(z+1,-1) + "2";
    }
    else if (s[k-1] == ")" && s[k] == ")"){
        let c = 1;
        for (var z = k-2; z>=0; z--){
            if (s[z] == "("){
                c -= 1;
            }
            if (s[z] == ")"){
                c += 1;
            }
            if (c == 0){
                break;
            }
        }
        t = s.slice(0,z) + ")" + s.slice(z+1,k-1) + ".." + s.slice(k+1,-1) + "2";
    }
    if (k == s.length-2){
        t = t.slice(0,-1) + "2";
        if (s[k] == "." || s.slice(-1) == "0") {
            return [t];
        }
        s = s.slice(0,-1) + "2";
    }
    if (s.slice(-1) == "0"){
        return [t];
    }
    if (s[k] == "."){
        s = s.slice(0,-1) + "0";
    }
    return [s,t];
}

function gen_start(k,s=0,e=false){
    if (k<s){
        return [];
    }
    if (!e && k===1 && s===0){
        return [];
    }
    if (k===0){
        return [""];
    }
    let a = [];
    if (s<1){//oh yeah i need this cos it can't be nested lmao
        for (i of gen_start(k-1,s+1,e)){
            a.push("(" + i);
        }
    }
    if ((s>0 || e) && !(s>0 && e)){
        for (i of gen_start(k-1,s,e)){
            a.push("." + i);
        }
    }
    if (s>0){
        for (i of gen_start(k-1,s-1,e)){
            a.push(")" + i);
        }
    }
    return a;
}

function solve(a,b){
    /* only works up to 10x10; for larger use BigInts instead */
    if (a>b){
        [a,b] = [b,a];
    }
    let z = {};
    for (i of gen_start(a)){
        z[i+"2"] = 1;
    }
    for (var x=1; x<b-1; x++){
        for (var y=0; y<a; y++){
            let z_new = {};
            for (i in z){
                for (j of doable_ways(i,y)){
                    if (z_new[j] !== undefined){
                        z_new[j] += z[i];
                    } else {
                        z_new[j] = z[i];
                    }
                }
            }
            z = z_new;
        }
    }
    let s = 0;
    for (i of gen_start(a-2,0,true)){
        i = "("+i+")"+"2";
        if (i in z){
            s += z[i];
        }
    }
    return s;
}

function complete(a,b,ca,cb,t){
    let z = {};
    z[t] = 1;
    for (var x=ca; x<a-1; x++){
        for (var y=(x==ca?cb:0); y<b; y++){
            let z_new = {};
            for (i in z){
                for (j of doable_ways(i,y)){
                    if (z_new[j] !== undefined){
                        z_new[j] += z[i];
                    } else {
                        z_new[j] = z[i];
                    }
                }
            }
            z = z_new;
        }
    }
    s = 0;
    for (i of gen_start(a-2,0,true)){
        i = "("+i+")"+"2";
        if (i in z){
            s += z[i];
        }
    }
    return s;
}

const MAGIC_ARRAY = [47001928863, 25470438117, 17428179206, 28126769898, 18426800213, 20720704806, 9734765199, 7066469265, 28126769898, 15582094167, 8638791375, 17450859732, 13196652281, 17428179206, 9027747056, 6407617170, 8638791375, 5505547210, 7066469265, 3148320711, 2975992662, 25470438117, 14019943450, 9027747056, 15582094167, 10560401801, 9734765199, 4652728166, 3148320711, 18426800213, 10560401801, 5505547210, 13196652281, 10204728761]
/* computed via
MAGIC_ARRAY = [];
for (i of gen_start(10)){
    MAGIC_ARRAY.push(complete(10,10,0,1,i+"2"));
}
*/

const MAX_BOARD_SIZE = 467260456608;

function get_index(r,n=10){
    // not safe for r>=NUMBER_OF_GRIDS
    console.assert(r < MAX_BOARD_SIZE);
    let i = 0;
    while (r >= MAGIC_ARRAY[i]){
        r -= MAGIC_ARRAY[i];
        i += 1;
    }
    let cur = gen_start(n)[i] + "2";
    let output = [cur];
    for (var x=1; x<n-1; x++){
        for (var y=0; y<n; y++){
            let A = doable_ways(cur,y);
            console.assert(A.length > 0 && A.length < 3);
            if (A.length == 1){
                cur = A[0];
                continue;
            }
            let z_new = A[0];
            let count_of = complete(n,n,x,y+1,z_new);
            if (r >= count_of){
                cur = A[1];
                r -= count_of;
            } else {
                cur = A[0];
            }
        }
        output.push(cur);
    }
    return output;
}

const PIPE_DICT = {
	3: 4,
	5: 0,
	6: 5,
	9: 2,
	10: 1,
	12: 3,
}

function convert(bracket_rep,n=10){
    let A = [];
    for (var i = 0; i<n; i++){
        let B = [];
        var l = false;
        for (var j = 0; j<n; j++){
            var v_up = false;
            var v_down = false;
            if (i>0 && bracket_rep[i-1][j] != "."){
                v_up = true;
            }
            if (i<n-1 && bracket_rep[i][j] != "."){
                v_down = true;
            }
            var v_left = l;
            var v_right = (v_up + v_down + v_left == 1);
            B.push(PIPE_DICT[v_right+2*v_up+4*v_left+8*v_down]);
            l = v_right;
        }
        A.push(B);
    }
    return A;
}

function pretty_print(normal_rep){
    PIPES = "\u2500\u2502\u250c\u2510\u2514\u2518";
    for (var B of normal_rep){
        s = "";
        for (var i of B){
            s += PIPES[i];
        }
        console.log(s);
    }
}

function see(i){
    pretty_print(convert(get_index(i)));
}

function get_daily_number(day){
    if (day===undefined){
        var day = Math.floor(Date.now() / 86400000) - START_DAY + 1;
    }
    var tmp = new MersenneTwister(day);
    var board_num = MAX_BOARD_SIZE;
    c = 0;
    while(board_num>=MAX_BOARD_SIZE){
        c++;
        board_num1 = tmp.genrand_int32();
        board_num2 = tmp.genrand_int32();
        k = 2**7
        board_num = board_num2*k + board_num1%k;
    }
    return board_num;
}

const START_DAY = 19054+577;
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

const attempts = 5;

const m = 10;
const n = 10;

var locked = false;
var game_attempts = 0;
var total_solves = 0;

var day = Math.floor(Date.now() / 86400000) - START_DAY + 1;
if (day<1){
    day = 1;
}

board = [].concat(...convert(get_index(get_daily_number(day))));

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
    if (adding){
        user_boards[i][j][k] |= 1 << dir;
    } else {
		user_boards[i][j][k] &= ~(1 << dir);
    }
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
    if (i==current_board)new_highlight(j,k);

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
		draw(i,j,k,dir1,true);
		draw(i_,j_,k_,dir2,true);
	} else {
		draw(i,j,k,dir1,false);
		draw(i_,j_,k_,dir2,false);
	}
	i_ = i;
	j_ = j;
	k_ = k;
	save_to_storage();
}

function mouseleft(){
    resetDrag();
    clear_highlight();
}

for (var i=0;i<attempts;i++){
	document.getElementById(`table${i}`).addEventListener('mouseleave', mouseleft);
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

highlighting = true;

function toggle_highlighting(){
    highlighting = !highlighting;
    clear_highlight();
}

last_highlight_j = 0;
last_highlight_k = 0;
function new_highlight(j,k){
    if (!highlighting || (j==last_highlight_j && k==last_highlight_k))return;
    for (var i=0;i<current_board;i++){
        for (l in [0,1,2,3]){
            s = ['tl','tr','bl','br'];
            document.getElementById(`${i}.${j}.${k}`+s[l]).classList.add('highlight');
        }
    }
    clear_highlight();
    last_highlight_j = j;
    last_highlight_k = k;
}

function clear_highlight(){  
    for (var i=0;i<attempts;i++){
        for (l in [0,1,2,3]){
            s = ['tl','tr','bl','br'];
            document.getElementById(`${i}.${last_highlight_j}.${last_highlight_k}`+s[l]).classList.add('instagreen');
            document.getElementById(`${i}.${last_highlight_j}.${last_highlight_k}`+s[l]).classList.remove('highlight');
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
    var i = 0;
    var j = 1;
    let last = 2;
    let c = 0;
    while (i != 0 || j != 0){
        for (var k=0; k<4; k++){
            if (k==last)continue;
            var t = [[0,2,4],[1,4,5],[0,3,5],[1,2,3]][k].indexOf(z[i*n+j])
            if (t != -1){
                break;
            }
        }
        switch (k){
            case 0:
                j += 1;
                break;
            case 1:
                i -= 1;
                break;
            case 2:
                j -= 1;
                break;
            case 3:
                i += 1;
                break;
        }
        last = (k + 2)%4;
        c++;
    }
	if (c==m*n-1) return z;
    return false;
}

var solve_stats = new Array(attempts+1).fill(0)

function save_to_storage(){
	localStorage.setItem("loopdle2", JSON.stringify({
		day_num: day,
		boards: user_boards,
		attempt_no: current_board,
		stats: solve_stats,
		solved: locked,
		game_attempts: game_attempts,
		total_solves: total_solves,
        highlighting: highlighting,
        streak: streak,
        last_streak: last_streak,
	}));
}

streak = 0;
last_streak = -1;

function load_from_storage(){
	if (localStorage.getItem("loopdle2") === null)return;
	z = JSON.parse(localStorage.getItem("loopdle2"));
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
    highlighting = z.highlighting;
    last_streak = z.last_streak;
    if (day-last_streak > 1){
        streak = 0;
    } else {
        streak = z.streak;
    }
}

document.getElementById("invalidboard").style.visibility = 'hidden';
document.getElementById("congratulations").style.visibility = 'hidden';
document.getElementById("share").style.visibility = 'hidden';

function fill_greens(){
    if (locked || (current_board >= attempts)){
        alert("Invalid operation.");
        return;
    }

    let g = false;
    for (j=0;j<n;j++){
        for (k=0;k<m;k++){
            if (user_boards[current_board][j][k] != 0){
                g = true;
                break;
            }
        }
        if (g)break;
    }

    if (g){
        if (!confirm("This will copy green cells from previous grids, but overwrite all your current progress. Are you sure?"))return;
    }
    clear_grid(false);
    for (j=0;j<n;j++){
        for (k=0;k<m;k++){
            for (i=0;i<attempts;i++){
                p = PIPE_DICT[user_boards[i][j][k]];
                if (p === board[j*m+k] && j!=0 && j!=n-1 && k!=0 && k!=m-1){
                    //yeah at this point i have resigned myself to assuming m=n
                    p = PIPE_DICT[board[j*m+k]];
                    for (var l=0;l<4;l++){
                        if (user_boards[i][j][k] & (1<<l)){
                            draw(current_board,j,k,l,true);
                            let d1=0;
                            let d2=0;
                            if (l==0){d1=1}
                            if (l==1){d2=-1}
                            if (l==2){d1=-1}
                            if (l==3){d2=1}
                            draw(current_board,j+d2,k+d1,(l+2)%4,true);
                        }
                    }
                }
            }
        }
    }
	save_to_storage();
}

function clear_grid(c){
    if (locked || (current_board >= attempts)){
        alert("Invalid operation.");
        return;
    }

    let g = false;
    for (j=0;j<n;j++){
        for (k=0;k<m;k++){
            if (user_boards[current_board][j][k] != 0){
                g = true;
                break;
            }
        }
        if (g)break;
    }

    if (g && c){
        if (c){
            if (!confirm("This will clear the progress on your current grid. Are you sure?"))return;
        }
    }
    for (j=0;j<n;j++){
        for (k=0;k<m;k++){
            for (var l=0;l<4;l++){
                draw(current_board,j,k,l,false);
            }
        }
    }
	save_to_storage();
}
var chart;
Chart.defaults.color = "#fff";
Chart.defaults.borderColor = "#aaf";
Chart.register(ChartDataLabels);

function update_stats(){
    document.getElementById("streak").innerHTML = streak;
    document.getElementById("wins").innerHTML = total_solves;
    document.getElementById("atts").innerHTML = game_attempts;
    document.getElementById("winrate").innerHTML = game_attempts?Math.round(total_solves/game_attempts*100):"???";
    if (total_solves > 0){
        let average = 0;
        for (var i=1;i<6;i++){
            average += solve_stats[i]*i;
        }
        average /= total_solves;
        document.getElementById("avg").innerHTML = average.toFixed(2);
    } else {
        document.getElementById("avg").innerHTML = "???";
    }
    
    if (chart!==undefined)chart.destroy();
    chart = new Chart("statsgraph", {
        type: "bar",
        data: {
            labels: [1,2,3,4,5],
            datasets: [{
                backgroundColor: "#ccf",
                data: solve_stats.slice(1,),
            }]
        },
        options: {
            plugins: {
                title: {
                    text: "Your loopdle2 stats",
                    display: true,
                    font: {
                        size: 30
                    },
                    padding: 30
                },
                legend: {
                    display: false
                },
                datalabels: {
                    anchor: 'end', // Position of the data labels (start, center, end, or auto)
                    align: 'end', // Alignment of the data labels (start, center, end, or auto)
                    font: {
                        weight: 'bold' // Font weight of the data labels
                    },
                }
            },
            scales: {
                y: {
                    ticks: {
                        precision: 0,
                    },
                    border: {
                        display: false,
                    }
                },
                x:{
                    title: {
                        text: "Number of attempts",
                        display: true,
                        font: {
                            size: 20
                        }
                    },
                    grid: {
                        display: false
                    },
                },
            },

        }
      });
}

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
					correct += 1;
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
		if (correct == (m-2)*(n-2)){
			document.getElementById("congratulations").style.visibility = 'visible';
			document.getElementById("share").style.visibility = 'visible';
			document.getElementById("congratulations").innerHTML = `You got it in ${current_board} attempts!`;
			locked = true;
			solve_stats[current_board]++;
			total_solves += 1;
            if (day-last_streak === 1){
                streak += 1;
            } else if (day-last_streak > 1) {
                streak = 1;
            }
            last_streak = day;
            update_stats();
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
				p = PIPE_DICT[user_boards[i][j][k]];
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
	copyToClipboard(`Loopdle2 ${day} ${current_board}/${attempts}`+s);
	alert("copied to clipboard");
}

function updateTimeLeft(){
	var seconds_left = Math.floor((86400000 * (START_DAY + day) - Date.now())/1000);
	if (seconds_left < 0){
		var s = "A new loopdle2 is here! Refresh the page.";
	} else {
		var S = seconds_left%60;
		if (S < 10){S = "0" + S}
		seconds_left = Math.floor(seconds_left/60);
		var M = seconds_left%60;
		if (M < 10){M = "0" + M}
		seconds_left = Math.floor(seconds_left/60);
		var H = seconds_left;
		var s = `Time until new loopdle2: ${H}:${M}:${S}`;
	}
	document.getElementById("countdown").innerHTML = s;
}

updateTimeLeft();
setInterval(updateTimeLeft,1000);

load_from_storage();
document.getElementById("everything").style.visibility = 'visible';

update_stats();





