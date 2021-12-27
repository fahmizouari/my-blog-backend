import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Query } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import * as fs from 'fs';
import * as path from 'path';

import * as pdf from 'html-pdf';
import * as Handlebars from 'handlebars';
import { deserialize, serialize } from 'v8';
import { pdfOptions } from 'src/config';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(@InjectModel('post') private readonly PostModal: Model<Post>, private schedulerRegistry: SchedulerRegistry) { };

  async create(createPostDto: CreatePostDto) {
    var post = new this.PostModal(createPostDto);

    return await post.save();
  }

  findAll() {
    return this.PostModal.find();
  }
  async findPerPagination(index: number, per: number) {
    if(index==0)
      return {
        "data": [],
        "numberPages" : 0
      };

    return {
      "data": await this.PostModal.find().skip((index-1) * per).limit(per),
      "numberPages" : Math.ceil(await this.PostModal.count() / per)
    };
  }

  findOne(id: string) {
    return this.PostModal.findById(id);
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    var option = { 'new': true };
    return this.PostModal.findByIdAndUpdate(id, updatePostDto, option);
  }

  remove(id: string) {
    return this.PostModal.findByIdAndDelete(id);
  }

  async createPostsPDF(listPosts): Promise<any> {
    var source = fs.readFileSync(
      path.join(__dirname, '../../view/testTemplate.hbs'),
      'utf8',
    );
    const directoryPath = path.join(__dirname, '../../public/file', '/');
    var template = await Handlebars.compile(source);
    const milis = new Date(Date.now()).getTime();
    var pdfPath = directoryPath + `${milis}.pdf`;
    const pdf = await this.createPdf(
      template({ data: JSON.parse(JSON.stringify(listPosts)) }),
      pdfOptions,
    );
    const file11 = await fs.writeFileSync(pdfPath, pdf);
    return {"pdf":pdf,"name":`${milis}.pdf`};

  }

  async createPdf(template, options): Promise<any> {
    return new Promise((resolve, reject) => {
      pdf.create(template, options).toBuffer((err, buffer) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }

/*   @Cron(CronExpression.EVERY_5_SECONDS, { name: 'EVERY_5_SECONDS', })
  handleCron() {
    console.log('Called every 5 seconds');
  }
  @Cron(CronExpression.EVERY_SECOND, { name: 'EVERY_SECOND', })
  handleCron2() {
    console.log('Called every second');
  } */

  addCronJob(name: string, seconds: string) {
    if (this.schedulerRegistry.doesExists("cron", name) == false) {
      const job = new CronJob(CronExpression.EVERY_5_SECONDS, () => {
        this.logger.warn(`time (${seconds}) for job ${name} to run!`);
      });
      console.log(this.schedulerRegistry.doesExists("cron", name));


      this.logger.warn(`create job!`);

      this.schedulerRegistry.addCronJob(name, job);
      job.start();
      return job.lastDate;
    }


    this.logger.warn(
      `job ${name} added for each minute at ${seconds} seconds!`,
    );
  }

  deleteCronJob(name) {
    const job = this.schedulerRegistry.getCronJob(name);

    job.stop();
    console.log(job.lastDate());

  }
}

