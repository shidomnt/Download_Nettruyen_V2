import fs from 'fs';

import {
  handleOBJ,
  analysisURL,
  removeAccents,
  analysisDocumentToTarget,
} from './helper.js';

fs.readFile('./input.in', { encoding: 'utf8' }, function (err, data) {
  if (err) {
    console.log(err);
    return;
  }
  data = data.trim().split('\n');
  data.forEach(async (line) => {
    const urlManga = line.trim();
    await (async () => {
      const rootPath = `/mnt/e/nettruyen/`;
      const nameSaveTarget = 'information';
      try {
        console.time('>>> CRAWL TOTAL TIME');
        console.time('>>> DOWNLOAD TOTAL TIME');
        console.log('>>> Crawling from website...');
        const document = await analysisURL(urlManga);
        const target = await analysisDocumentToTarget(document);
        target.data = target.data.reverse();
        const parserTargetToJSON = JSON.stringify(target);
        console.timeEnd('>>> CRAWL TOTAL TIME');
        console.log('>>> Start download file...\n');
        console.log('>>> ---------------------- <<<\n');
        await handleOBJ(target, rootPath);
        const pathSaveFile = `${rootPath}${removeAccents(
          target.nameManga
        )}/${nameSaveTarget}`;
        fs.mkdirSync(pathSaveFile, { recursive: true });
        fs.writeFileSync(`${pathSaveFile}/desc.json`, parserTargetToJSON, {
          mode: 777,
        });
        console.log('>>> Saved File!');
        console.timeEnd('>>> DOWNLOAD TOTAL TIME');
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    })();
  });
});
