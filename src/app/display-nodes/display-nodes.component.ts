import { Component, OnInit } from '@angular/core';
import { NodeService } from '../node-service/node.service';
@Component({
  selector: 'app-display-nodes',
  templateUrl: './display-nodes.component.html',
  styleUrls: ['./display-nodes.component.scss']
})
export class DisplayNodesComponent implements OnInit {
  public filter: FilterNode = new FilterNode();
  constructor(public ref: NodeService) { }

  ngOnInit() {
  }
  public newNode() {
    this.ref.Tree.newNode();
  }
  public saveNodes() {
    this.ref.saveNodes();
  }
  
}

export class FilterNode {
  public depth: number = -1;
  public name: string;
  //public targetDepth: number;
}
