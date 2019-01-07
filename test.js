const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.join(__dirname, 'data.txt'), {
  // Controls how many 'data' events are emitted
  highWaterMark: 3072
});

const writeStream = fs.createWriteStream(path.join(__dirname, '/output.txt'));

let count = 0;
/* Note different types of streams have different events. E.g. a readable
 * stream does not have a 'finish' event, and a write stream does not have
 * a 'data' event
 */
readStream
  .on('readable', function () {
    console.log('Read Stream Readable: ', arguments);
  })
  .on('data', function () {
    count++;
    console.log('Read Stream Data: ', );
    if (count === 1) {
      this.emit('error', new Error('Read Stream Error'));
      writeStream.destroy(new Error('Write Stream Destroyed'));
      //readStream.destroy(new Error('Read Stream Destroyed'));
    }
  })
  .on('error', function (error) {
    console.log('Read Stream Error: ', error);
  })
  .on('close', function () {
    console.log('Read Stream Close: ', arguments);
  })
  .on('end', function () {
    console.log('Read Stream End: ', arguments);
  });

writeStream
  .on('drain', function () {
    console.log('Write Stream Drain: ', arguments);
  })
  .on('pipe', function () {
    console.log('Write Stream Pipe: ', );
    //this.emit('error', new Error('Write Stream Error'));
  })
  .on('unpipe', function () {
    console.log('Write Stream Unpipe: ', );
  })
  .on('finish', function () {
    console.log('Write Stream Finish: ', arguments);
  })
  .on('close', function () {
    console.log('Write Stream Close: ', arguments);
  })
  .on('error', function (error) {
    console.log('Write Stream Error: ', error);

  });

readStream
  //.pipe(process.stdout);
  .pipe(writeStream);
