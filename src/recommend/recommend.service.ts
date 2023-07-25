// import { Injectable } from '@nestjs/common';
// import * as puppeteer from 'puppeteer';
// import { v4 as uuidv4 } from 'uuid';
// import { S3 } from 'aws-sdk';
// import { ConfigService } from '@nestjs/config';
// import { config } from 'dotenv';

// config();
// const configService = new ConfigService();

// @Injectable()
// export class RecommendService {
//   private s3: S3;
//   constructor() {
//     // AWS 인증 정보 설정
//     this.s3 = new S3({
//       accessKeyId: configService.get('AWS_ACCESS_KEY'),
//       secretAccessKey: configService.get('AWS_SECRET_KEY'),
//       region: null, // AWS S3 버킷이 위치한 리전
//     });
//   }

//   async getDataViaPuppeteer() {
//     const URL =
//       'https://search.shopping.naver.com/best/home?categoryCategoryId=ALL&categoryDemo=A00&categoryRootCategoryId=ALL&chartDemo=F03&chartRank=1&period=P1D&windowCategoryId=10000283&windowDemo=F03&windowRootCategoryId=10000283';
//     //브라우저 인스턴스를 생성
//     const browser = await puppeteer.launch({
//       headless: 'new', //브라우저를 헤드리스(headless) 모드로 실행하지 않고 실제 브라우저 창을 표시
//     });
//     const page = await browser.newPage(); //새 페이지를 생성
//     //해당 URL로 이동
//     await page.goto(URL, {
//       waitUntil: 'networkidle2', //네트워크 활동이 없을 때까지 페이지 로딩을 기다리도록 설정
//     });
//     //페이지 내에서 JavaScript 코드를 실행
//     const results = await page.evaluate(() => {
//       const propertyList = [];

//       document
//         .querySelectorAll('.imageProduct_item__KZB_F')
//         .forEach(async (z) => {
//           const tempImgList = [];
//           //이미지뽑아오기
//           z.querySelectorAll('.imageProduct_thumbnail__Szi5F').forEach(
//             async (x) => {
//               const imgElement = x.querySelector('span > img');
//               if (imgElement instanceof HTMLImageElement && imgElement.src) {
//                 const img = imgElement.currentSrc;
//                 const data = img.split(',')[1];
//                 const ContentType = img.split(';')[0].split(':')[1];
//                 tempImgList.push(data, ContentType);
//               }
//             },
//           );

//           //랭크뽑아오기
//           const element = z
//             .querySelector('.imageProduct_rank__lEppJ')
//             .textContent.trim();
//           const data = {
//             rank: element,
//             title: z.querySelector('.imageProduct_title__Wdeb1')?.textContent,
//             price: z.querySelector('.imageProduct_price__W6pU1 > strong')
//               ?.textContent,
//             img: tempImgList[0],
//             ContentType: tempImgList[1],
//           };

//           propertyList.push(data);
//         });

//       return propertyList;
//     });

//     //브라우저 인스턴스를 닫아
//     await browser.close();
//     const resultlist = results.splice(0, 10);
//     console.log('getDataViaPuppeteer results :', resultlist);
//     // const lastlist = await Promise.all(
//     //   resultlist.map(async (item) => {
//     //     const fileData = Buffer.from(item.img, 'base64');
//     //     const bucketName = 'giftwave-s3-bucket';
//     //     const type = item.ContentType;
//     //     const uuid = uuidv4();
//     //     const uploadParams = {
//     //       Bucket: bucketName,
//     //       Key: `${uuid}`,
//     //       Body: fileData,
//     //       ContentType: type,
//     //     };
//     //     const uploadResult = await this.s3.upload(uploadParams).promise();
//     //     return {
//     //       rank: item.rank,
//     //       title: item.title,
//     //       price: item.price,
//     //       img: uploadResult.Location,
//     //     };
//     //   }),
//     // );
//     // console.log(lastlist);
//     return resultlist;
//   }
// }
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

@Injectable()
export class RecommendService {
  private s3: S3;
  constructor() {
    // AWS 인증 정보 설정
    this.s3 = new S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_KEY'),
      region: null, // AWS S3 버킷이 위치한 리전
    });
  }

  async getDataViaPuppeteer() {
    const URL =
      'https://search.shopping.naver.com/best/home?categoryCategoryId=ALL&categoryDemo=A00&categoryRootCategoryId=ALL&chartDemo=F03&chartRank=1&period=P1D&windowCategoryId=10000283&windowDemo=F03&windowRootCategoryId=10000283';

    const browser = await puppeteer.launch({
      headless: false, // 'new'를 'false'로 변경
    });
    const page = await browser.newPage();

    await page.goto(URL, {
      waitUntil: 'networkidle2',
    });
    await page.waitForSelector('.imageProduct_thumbnail__Szi5F > span > img');
    const results = await page.evaluate(() => {
      const propertyList = [];

      const imageProductItems = document.querySelectorAll(
        '.imageProduct_item__KZB_F',
      );
      for (const z of imageProductItems) {
        const tempImgList = [];

        const imgElement = z.querySelector(
          '.imageProduct_thumbnail__Szi5F > span > img',
        );
        const imgUrl = imgElement?.getAttribute('src');

        const imgdata = imgUrl.split(',')[1];
        const ContentType = imgUrl.split(';')[0].split(':')[1];
        tempImgList.push({ img: imgdata, ContentType: ContentType });

        const element = z
          .querySelector('.imageProduct_rank__lEppJ')
          ?.textContent.trim();
        const data = {
          rank: element,
          title: z.querySelector('.imageProduct_title__Wdeb1')?.textContent,
          price: z.querySelector('.imageProduct_price__W6pU1 > strong')
            ?.textContent,
          img: tempImgList[0]?.img,
          ContentType: tempImgList[0]?.ContentType,
        };

        propertyList.push(data);
      }

      return propertyList;
    });

    await browser.close();
    const resultlist = results.slice(0, 10);
    console.log('getDataViaPuppeteer results:', resultlist);
    return resultlist;
  }
}
