import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import {AuthenticationService, UserDetails} from '../../authenticaion.service';
import {ServerService} from '../../server.service';


@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.css']
})
export class BioComponent implements OnInit {

  bio: [];
  relation: Boolean;

  constructor( private router: Router, private route: ActivatedRoute, 
    private auth: AuthenticationService, private serverService: ServerService,) { }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.serverService.getBio(params.id).subscribe(
        bio => {
          this.bio = bio
          console.log(this.bio)
        }
      ),
      err => {
        console.error(err);
      }
    });

    this.route.params.subscribe(params => {

      this.serverService.checkRelationship(params.id).subscribe(
        relation => {
          this.relation = relation
          console.log(this.relation)
        }
      ),
      err => {
        console.error(err);
      }
    });
  }

  sendRequest() {
    this.route.params.subscribe(params => {

      this.serverService.sendRequest(params.id).subscribe(
        request => {
          console.log(request)
        }
      ),
      err => {
        console.error(err);
      }
    });

    location.reload()
    
  }

}
