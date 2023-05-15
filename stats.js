document.getElementById('UnbeatenMaps').addEventListener('click', () => {
    document.getElementById('UnbeatenMaps-out').style.display = "flex";
    document.getElementById('HardestMaps-out').style.display = "none";
    document.getElementById('MostVerifiedMaps-out').style.display = "none";
    document.getElementById('LevelSearch-out').style.display = "none";
    document.getElementById('UnbeatenMaps').classList.add('tab-active');
    document.getElementById('HardestMaps').classList.remove('tab-active');
    document.getElementById('MostVerifiedMaps').classList.remove('tab-active');
    document.getElementById('LevelSearch').classList.remove('tab-active');
});
document.getElementById('HardestMaps').addEventListener('click', () => {
    document.getElementById('UnbeatenMaps-out').style.display = "none";
    document.getElementById('HardestMaps-out').style.display = "flex";
    document.getElementById('MostVerifiedMaps-out').style.display = "none";
    document.getElementById('LevelSearch-out').style.display = "none";
    document.getElementById('UnbeatenMaps').classList.remove('tab-active');
    document.getElementById('HardestMaps').classList.add('tab-active');
    document.getElementById('MostVerifiedMaps').classList.remove('tab-active');
    document.getElementById('LevelSearch').classList.remove('tab-active');
});
document.getElementById('MostVerifiedMaps').addEventListener('click', () => {
    document.getElementById('UnbeatenMaps-out').style.display = "none";
    document.getElementById('HardestMaps-out').style.display = "none";
    document.getElementById('MostVerifiedMaps-out').style.display = "flex";
    document.getElementById('LevelSearch-out').style.display = "none";
    document.getElementById('UnbeatenMaps').classList.remove('tab-active');
    document.getElementById('HardestMaps').classList.remove('tab-active');
    document.getElementById('MostVerifiedMaps').classList.add('tab-active');
    document.getElementById('LevelSearch').classList.remove('tab-active');
});
document.getElementById('LevelSearch').addEventListener('click', () => {
    document.getElementById('UnbeatenMaps-out').style.display = "none";
    document.getElementById('HardestMaps-out').style.display = "none";
    document.getElementById('MostVerifiedMaps-out').style.display = "none";
    document.getElementById('LevelSearch-out').style.display = "flex";
    document.getElementById('UnbeatenMaps').classList.remove('tab-active');
    document.getElementById('HardestMaps').classList.remove('tab-active');
    document.getElementById('MostVerifiedMaps').classList.remove('tab-active');
    document.getElementById('LevelSearch').classList.add('tab-active');
});

function getHardestLevels() {
    fetch('stats-data.json')
    .then((response) => response.json())
    .then(data => {
        
        data.forEach((level) => {
            level.score = 1 - level.statistics.difficulty;
            if (!level.statistics.time) {
                level.statistics.time = 9007199254740990;
            }
            level.statistics.finishes = level.statistics.total_played * level.statistics.difficulty;
            if (Date.now() - level.creation_timestamp < 604800000) {
                data.splice(data.indexOf(level), 1);
            }
            percentage = (level.statistics.total_played ** 2) / (1000 ** 2);
            percentage > 1 ? level.percentage = 1 : level.percentage = percentage;
        });
        
        data.sort(function(a, b) {
            return a.statistics.difficulty - b.statistics.difficulty;
        });
        // diff0++ & top100diff++
        var i = 0;
        data.forEach(level => {
            if (i < 100) {
                if (level.statistics.difficulty == 0) {
                    i--;
                    level.score++;
                }
                level.score++;
                i++;
            }
        });

        data.sort(function(a, b) {
            return b.statistics.time - a.statistics.time;
        });
        // timeN/a++ & top100time++
        i = 0;
        data.forEach(level => {
            if (i < 100) {
                /*if (level.statistics.time == 9007199254740990) {
                    i--;
//                            level.score++;
                }*/
                level.score++;
                i++;
            }
        });

        data.sort(function(a, b) {
            return a.statistics.finishes - b.statistics.finishes;
        });
        // 0finish++ & top100finish++
        i = 0;
        data.forEach(level => {
            if (i < 100) {
                if (level.statistics.finishes == 0) {
                    i--;
                    level.score++;
                }
                level.score++;
                i++;
            }
        });

            

        data.sort(function(a, b) {
            return a.creation_timestamp - b.creation_timestamp;
        });

        data.sort(function(a, b) {
            return b.score*b.percentage - a.score*a.percentage;
        });

        // console.log(data);

        i = 0;
        data.forEach(level => {
            if (i < 100) {
                document.getElementById("HardestMaps-out").innerHTML += `<div class="leaderboard-item"><a href="https://grabvr.quest/levels/viewer/?level=${level.identifier}">${level.title}</a>by <span>${level.creators}</span><span>date</span><span>${(1 - (Math.round(level.statistics.difficulty * 10000) / 10000))*100}% | ${(Math.round((level.score*level.percentage) * 10000) / 10000)}</span></div>`;
                i++;
            }
        });
        
        // data.sort(function(a, b) {
        //     return a.creation_timestamp - b.creation_timestamp;
        // });

        // data.sort(function(a, b) {
        //     return b.score - a.score;
        // });

        // console.log(data);

        // i = 0;
        // data.forEach(level => {
        //     if (i < 100) {
        //         document.getElementById("leaderboard-output-2").innerHTML += "<div><a href='https://grabvr.quest/levels/viewer/?level=" + level.identifier + "'>" + level.title + "</a> by " + level.creators + " <p>(" + (Math.round(level.statistics.difficulty * 10000) / 10000) + " | " + (Math.round(level.score * 10000) / 10000) + ")</p></div>";
        //         i++;
        //     }
        // });
    });
}

function getUnbeatenLevels() {
    fetch('diff.json')
    .then((response) => response.json())
    .then(data => {
        data.reverse().forEach(item => {
            document.getElementById('UnbeatenMaps-out').innerHTML += `<div class="leaderboard-item"><a href="${item["link"]}">${item["title"]}</a>by <span>user</span><span>${item["age"]}</span><span>${item["plays"]} plays</span></div>`;
        });
    });
}

async function getTopPlayers(limit = 10) {
    fetch('stats-data.json')
    .then(res => res.json())
    .then(json_data => {
        console.log(json_data);
        var playersArr = {};
        json_data.forEach(json => {
            user_id = json.identifier.split(":")[0];
            if (playersArr[user_id]) {
                playersArr[user_id] += 1;
            } else {
                playersArr[user_id] = 1;
            }
        });
        const topPlayers = Object.keys(playersArr).sort(function(a,b){return playersArr[b]-playersArr[a]}).slice(0, limit);
        topPlayers.forEach(player => {
            document.getElementById("MostVerifiedMaps-out").innerHTML += `<div class="leaderboard-item"><a href="https://grabvr.quest/levels?tab=tab_other_user&user_id=${player}">${player}</a><span>${playersArr[player]} maps</span></div>`;
        });
    });
}

getTopPlayers(10);
getUnbeatenLevels();
getHardestLevels()