import { Injectable } from '@angular/core';
import { Tree, INodeRecord, fetchedTree } from './tree';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  public Tree: Tree;

  protected maxDepth: number = Number.MAX_SAFE_INTEGER;
  public get Depth() {
    return this.maxDepth;
  }
  public set Depth(value: number) {
    if (value <= 0) {
      this.maxDepth = Number.MAX_SAFE_INTEGER;
    } else {
      this.maxDepth = value;
    }
  }

  public istooDeepNode(rec: INodeRecord): boolean {
    return rec.Depth >= this.maxDepth;
  }
  public atMaxDepth(rec: INodeRecord): boolean {
    return rec.Depth == this.maxDepth;
  }
  constructor() {
    
    this.Tree =this.fetchNodes();
  }

  public fetchNodes(): Tree {

    let nodes: Array<INodeRecord> = (<fetchedTree>JSON.parse(localStorage.getItem('Tree') || "{\"Nodes\": null}")).Nodes ;
    return new Tree(nodes || []);
    
  }
  public saveNodes() {

    let savedNodes: Array<INodeRecord> = this.Tree.DBRecord;
    console.log("Saved Nodes", savedNodes);
    localStorage.setItem('Tree', JSON.stringify(<fetchedTree>{ Nodes: savedNodes }));
    //this.Tree = this.fetchNodes();


    window.location.reload();
  }
  public filter(Name: string, Depth: number) {
    this.Tree.Filter(Name, Depth);
  }

}
