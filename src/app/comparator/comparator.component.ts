import { Component, OnInit } from '@angular/core';
import {DocumentService} from '../services/document.service';
import {OpenAPIObject} from '../model/OpenAPIObject';
import {Endpoint} from '../model/Endpoint';

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.css']
})
export class ComparatorComponent implements OnInit {

  displayedColumns: string[] = ['method', 'path'];

  input1url: string;
  input2url: string;
  input1raw: string;
  input2raw: string;

  input1;
  input2;

  input1Endpoints: Endpoint[] = [];
  input2Endpoints: Endpoint[] = [];

  endpoints1: Endpoint[] = [];
  endpoints2: Endpoint[] = [];
  endpointsBoth: Endpoint[] = [];

  resultsReady = false;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
  }

  readRaw1() {
    this.input1Endpoints = this.load(this.input1raw);
  }

  readUrl1() {
    if (this.input1url && this.input1url.length > 0) {
      this.documentService.getDocument(this.input1url).subscribe((data: string) => {
        this.input1Endpoints = this.load(data);
      });
    }
  }

  private load1(input) {
    this.input1Endpoints = [];
    this.input1 = JSON.parse(input);
    for (const path in this.input1.paths) {
      if (this.input1.paths.hasOwnProperty(path)) {
        for (const method in this.input1.paths[path]) {
          if (this.input1.paths[path].hasOwnProperty(method)) {
            const endpoint: Endpoint = new Endpoint();
            endpoint.path = path;
            endpoint.method = method;
            this.input1Endpoints.push(endpoint);
          }
        }
      }
    }
    console.log('Total paths: ' + this.input1Endpoints.length);
    console.log(this.input1Endpoints);
  }

  readRaw2() {
    this.input2Endpoints = this.load(this.input2raw);
  }

  readUrl2() {
    if (this.input2url && this.input2url.length > 0) {
      this.documentService.getDocument(this.input2url).subscribe((data: string) => {
        this.input2Endpoints = this.load(data);
      });
    }
  }

  private load(input): Endpoint[] {
    const endpoints = [];
    this.input2 = JSON.parse(input);
    for (const path in this.input2.paths) {
      if (this.input2.paths.hasOwnProperty(path)) {
        for (const method in this.input2.paths[path]) {
          if (this.input2.paths[path].hasOwnProperty(method)) {
            const endpoint: Endpoint = new Endpoint();
            endpoint.path = path;
            endpoint.method = method;
            endpoints.push(endpoint);
          }
        }
      }
    }
    console.log('Total paths: ' + endpoints.length);
    console.log(endpoints);
    return endpoints;
  }

  compare() {
    this.endpoints1 = [];
    this.endpoints2 = [];
    this.endpointsBoth = [];
    this.input1Endpoints.forEach(end1 => {
      let found = false;

      this.input2Endpoints.forEach(end2 => {
        if (end1.path === end2.path && end1.method === end2.method) {
          this.endpointsBoth.push(end1);
          found = true;
        }
      });

      if (!found) {
        this.endpoints1.push(end1);
      }
    });

    this.input2Endpoints.forEach(end2 => {
      let found = false;
      this.input1Endpoints.forEach(end1 => {
        if (end1.path === end2.path && end1.method === end2.method) {
          found = true;
        }
      });
      if (!found) {
        this.endpoints2.push(end2);
      }
    });
    this.resultsReady = true;
  }

}
