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
    console.log('val', value);
    if (value < 0) {
      this.maxDepth = Number.MAX_SAFE_INTEGER;
    } else {
      this.maxDepth = value;
    }
  }
  public Name: string = '';

  public istooDeepNode(rec: INodeRecord): boolean {
    return rec.Depth > this.maxDepth;
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
    localStorage.setItem('Tree', JSON.stringify(<fetchedTree>{ Nodes: savedNodes }));
    //this.Tree = this.fetchNodes();


    window.location.reload();
  }
  public filter(Name: string, Depth: number) {
    this.Depth = Depth;
    this.Name = Name || '';
    this.Tree.Filter(Name);
  }
  public matchesFilterName(value: string): boolean {
    if (this.Name.length == 0) {
      return false;
    } else if(value == this.Name) {
      return true;
    }
  }
}
