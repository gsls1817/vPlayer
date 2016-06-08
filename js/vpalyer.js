new Vue({
    el: 'body',
    data: function() {
        return {
            audio: document.getElementsByTagName('audio')[0],
            storage: window.localStorage,
            range: 0.5,
            progress: 0,
            autoplay: false,
            loop: false,
            showCurrentTime: '0:00',
            showDurationTime: '0:00',
            search: '',
            lists: [],
            playList: [],
            mlist: []
        }
    },
    ready: function() {
        setInterval(this.setProgress, 500);
        var isAuto = this.storage.getItem('autoplay');
        isAuto === 'true' ? this.audio.autoplay = true : this.audio.autoplay = false;
        var isLoop = this.storage.getItem('loop');
        isLoop === 'true' ? this.audio.loop = true : this.audio.loop = false;
        this.mlist = JSON.parse(this.storage.getItem('testObject'));
    },
    methods: {
        setCurrentTime: function() {
            this.audio.currentTime = 15.555;
        },
        getDuration: function() {
            alert(this.audio.duration);
        },
        getStatus: function() {
            alert(this.audio.readyState);
        },
        setAutoPlay: function() {
            this.autoplay = !this.autoplay;
            alert(this.autoplay);
            this.storage.setItem('autoplay', this.autoplay);
        },
        setPlay: function() {
            this.audio.play()
        },
        setPause: function() {
            this.audio.pause()
        },
        nextMusic: function() {
            this.audio.src = 'http://m2.music.126.net/QN7Y3gJPLB6tXlZY7oo3gQ==/1378787588955489.mp3'
        },
        setLoop: function() {
            this.loop = !this.loop;
            this.storage.setItem('loop', this.loop);
        },
        setVolume: function() {
            return this.audio.volume = this.range;
        },
        setProgress: function() {
            var currentTime = this.audio.currentTime;
            MM = parseInt(currentTime / 60);
            SS = parseInt(currentTime % 60);
            var CT = MM + ':' + (SS < 10 ? '0' + SS : SS);
            this.showCurrentTime = CT;

            var duration = this.audio.duration;
            MM = parseInt(duration / 60);
            SS = parseInt(duration % 60);
            var DT = MM + ':' + (SS < 10 ? '0' + SS : SS);
            this.showDurationTime = DT;

            var value = currentTime / duration * 100;
            this.progress = value.toFixed(3);
        },
        formSubmit: function() {
            this.$http.get('api/searchApi.php', {
                's': this.search
            }).then(function(data) {
                this.lists = data.data.result.songs;
            }, function(response) {
                // error callback
            });
        },
        playMusic: function(id) {
            this.$http.get('api/detailApi.php', {
                'id': id
            }).then(function(data) {
                var result = data.data.songs[0];
                var mdata = {
                    'id': result.id,
                    'title': result.name,
                    'url':result.mp3Url,
                    'artists':result.artists[0].name
                };
                this.audio.src = mdata.url;
                this.audio.play();
                var obj = JSON.parse(this.storage.getItem('testObject'));
                if (this.storage.getItem('testObject') == null) {
                    this.playList.push(mdata);
                    this.storage.setItem('testObject', JSON.stringify(this.playList));
                } else {
                    var lock;
                    for(var i=0; i < obj.length; i++) {
                        if(mdata.url == obj[i].url){
                            lock = true;
                            return false;
                        } else {
                            lock = false;
                        }
                    };
                    if (lock == false) {
                        this.playList.push(mdata);
                        this.storage.setItem('testObject', JSON.stringify(this.playList));
                    } else {
                        alert('已经存在');
                    };
                }      
            }, function(response) {
                // error callback
            });
        },
        playHistoryList: function (id) {
            this.$http.get('api/detailApi.php', {
                'id': id
            }).then(function(data) {
                var music = data.data.songs[0];
                this.audio.src = music.mp3Url;
                this.audio.play();
            }, function(response) {
                // error callback
            });
        }
    }
})