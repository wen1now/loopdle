function doable_ways(s,k){
    if (s.slice(-1) == "2" || (s[k-1] == "(" && s[k] == ")")){
        return s.slice(0,-1)+(s[k]=="."?"0":"1");
    }
    if (s[k-1] == ")" && s[k] == "("){
        t = s.slice(0,k) + ".." + s.slice(k+2,-1) + "2";
    }
    else if (s[k-1] == "." && s[k] == "."){
        t = s.slice(0,k) + "()" + s.slice(k+2,-1) + "1";
    }
    else if (s[k-1] == "."){
        t = s.slice(0,k) + s[k] + "." + s.slice(k+2,-1) + "2";
    }
    else if (s[k] == "."){
        t = s.slice(0,k) + "." + s[k-1] + s.slice(k+2,-1) + "1";
    }
    if (s[-1] == "0"){
        return [t];
    }
    return [s,t];
}

function gen_start(k,s=0){
    if (k<s){
        return [];
    }
    if (k===0){
        return [""];
    }
    let a = [];
    for (i of gen_start(k-1,s)){
        a.push(i + ".");
    }
    for (i of gen_start(k-1,s+1)){
        a.push("(" + i);
    }
    if (s>0){
        for (i of gen_start(k-1,s-1)){
            a.push(")" + i);
        }
    }
    return a;
}

function solve(a,b){
    if (a>b){
        [a,b] = [b,a];
    }
}