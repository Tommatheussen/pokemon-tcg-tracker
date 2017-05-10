import { Component, OnInit } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

@Component({
  selector: 'pokemon-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public sets;
  public cards;
  public selectedset;
  constructor( private http: Http) { }

  ngOnInit(): void {
    this.http.get('/api/sets')
      .map((res: Response) => res.json())
      .subscribe(sets => this.sets = sets);
  }

  setSelected(set): void {
    let params = new URLSearchParams();
    params.append('set', set.name)

    this.http.get('/api/cards', { search: params })
      .map((res: Response) => res.json())
      .subscribe(cards => this.cards = cards);
  }  
}