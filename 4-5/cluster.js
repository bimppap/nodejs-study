const cluster = require('cluster')
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`master process id: ${process.pid}`);
    // cpu 갯수만큼 워커 생산
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    // 워커 종료시
    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
        console.log('code', code, 'signal', signal);
        cluster.fork();
    });
} else {
    // 워커들이 포트에서 대기
    http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.write('<h1>Hello Node</h1>');
        res.end('<p>Hello Cluster!</p>');
        setTimeout(() => { // 워커가 존재하는지 확인하기 위해 1초마다 강제 종료
            process.exit(1);
        }, 1000);
    }).listen(8086);
    console.log(`${process.pid}번 워커 실행`);
}