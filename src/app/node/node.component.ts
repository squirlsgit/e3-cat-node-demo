import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Node } from '../node-service/tree';
import { NodeService } from '../node-service/node.service';
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  protected nodeId: string;
  public node: Node;
  //public maxDepth: number = Number.MAX_SAFE_INTEGER;
  @Input('node') set NodeID(value: Node) {
    if (value.record.Id != this.nodeId) {
      this.nodeId = value.record.Id;
      this.node = value;
    }
  }
  @Input('depth') set depth(value: number) {
    if (value != this.maxDepth) {
      this.Depth = value;
    }
  }
  //@Output() onNew = new EventEmitter<Node>();

  protected maxDepth: number = Number.MAX_SAFE_INTEGER;
  public set Depth(value) {
    if (!value || value <= 0) {
      this.maxDepth = Number.MAX_SAFE_INTEGER;
    } else {
      this.maxDepth = Math.floor(value);
    }
  }
    
  constructor(public ref: NodeService) {


  }

  ngOnInit() {
  }
  public newNode() {
    //this.onNew.emit(this.node);
    this.ref.Tree.newNode(this.node.record.Id);
    this.node.ui.show = true;

  }
  public getChildTooltip(): string {
    return (this.node.record.Nodes.length == 1 ? '1 Child' : (this.node.record.Nodes.length + ' Children')) + ' at N-' + (this.node.record.Depth + 1);
  }
  public editName() {
    this.node.ui.edit = true;
  }
  public confirmEdit() {
    this.node.ui.edit = false;
  }
  public inEdit(): boolean {
    return !(!this.node.ui.edit);
  }
  public deleteNode() {
    console.log("sign delete node?");
    this.ref.Tree.signDeleteNode(this.nodeId);
  }
  public toggleDeleteNode() {
    console.log("sign delete node?");
    this.ref.Tree.signToggleDeleteNode(this.nodeId);
  }
  public toDelete(): boolean {
    return this.node.ui.delete;
  }
  public toggleShowChildren() {
    this.node.ui.show = !(this.node.ui.show);
  }
  public nodeHasChildren() {
    return this.node.hasChildren;

  }
  public nodeHasError(): boolean {
    return this.node.hasError;
  }

  public queryError() {
    this.ref.Tree.logErrors(this.nodeId);
    console.log("Node " + this.nodeId, this.node.hasError);
  }
 

}
