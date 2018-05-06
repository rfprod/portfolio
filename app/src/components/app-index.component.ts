import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';

import { AppContactComponent } from '../components/app-contact.component';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';

import { UserConfigService } from '../services/user-config.service';
import { GithubService } from '../services/github.service';
import { CodepenService } from '../services/codepen.service';

import 'rxjs/add/operator/first';

@Component({
	selector: 'app-index',
	templateUrl: '/views/app-index.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppIndexComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private dialog: MatDialog,
		private emitter: EventEmitterService,
		private userCongigService: UserConfigService,
		private githubService: GithubService,
		private codepenService: CodepenService,
		@Inject('Window') private window: Window
	) {
		console.log('this.el.nativeElement', this.el.nativeElement);
	}

	public data: any = {
		links: {
			codewars: 'https://www.codewars.com/users/' as string,
			hackerrank: 'https://www.hackerrank.com/' as string,
			github: 'https://github.com/' as string,
			codepen: 'https://codepen.io/' as string
		} as any,
		userConfig: {} as any,
		github: {} as any,
		githubRepos: [] as any[],
		githubLanguages: {} as any,
		githubLanguagesKeys: [] as string[],
		codepen: {} as any
	};

	private getUserConfig(): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.userCongigService.getData().first().subscribe(
			(data: any) => {
				this.data.userConfig = data;
				def.resolve();
			},
			(error: any) => {
				console.log('getUserConfig error', error);
				def.reject(error);
			}
		);
		return def.promise;
	}

	private getGithubProfile(): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.githubService.getProfile(this.data.userConfig.username.github).first().subscribe(
			(data: any) => {
				this.data.github = data;
				def.resolve();
			},
			(error: any) => {
				console.log('getGithubProfile error', error);
				def.reject(error);
			}
		);
		return def.promise;
	}

	private getGithubRepos(): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.githubService.getRepos(this.data.userConfig.username.github).first().subscribe(
			(data: any) => {
				this.data.githubRepos = data;
				for (let i = 0, max = this.data.githubRepos.length; i < max; i++) {
					this.getGithubRepoLanguages(this.data.githubRepos[i].name);
				}
				def.resolve();
			},
			(error: any) => {
				console.log('getGithubRepos error', error);
				def.reject(error);
			}
		);
		return def.promise;
	}

	private getGithubRepoLanguages(repoName: string): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.githubService.getRepoLanguages(this.data.userConfig.username.github, repoName).first().subscribe(
			(data: any) => {
				loop:
				for (const [lang, value] of Object.entries(data)) {
					if (lang.indexOf('$') !== -1) {
						console.log('don\'t copy object properties other than languages');
						break loop;
					}
					if (this.data.githubLanguages.hasOwnProperty(lang)) {
						this.data.githubLanguages[lang] += data[lang];
					} else {
						this.data.githubLanguages[lang] = data[lang];
					}
					this.data.githubLanguagesKeys = Object.keys(this.data.githubLanguages);
				}
				def.resolve();
			},
			(error: any) => {
				console.log('getGithubRepoLanguages error', error);
				def.reject(error);
			}
		);
		return def.promise;
	}

	private getCodepenProfile(): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.codepenService.getProfile(this.data.userConfig.username.codepen).first().subscribe(
			(data: any) => {
				this.data.codepen = data;
				def.resolve();
			},
			(error: any) => {
				console.log('getCodepenProfile error', error);
				def.reject(error);
			}
		);
		return def.promise;
	}

	public toggleApps(): void {
		console.log('TODO: toggle apps sidenav');
	}

	private dialogInstance: MatDialogRef<AppContactComponent>;

	public showContactDialog(): void {
		console.log('TODO: show contact dialog');
		this.dialogInstance = this.dialog.open(AppContactComponent, {
			height: '90vh',
			width: '90vw',
			maxWidth: '90vw',
			maxHeight: '90vh',
			disableClose: false,
			data: {
				domain: this.window.location.origin
			}
		});
		this.dialogInstance.afterClosed().first().subscribe((result: any) => {
			console.log('app contact dialog closed with result', result);
			this.dialogInstance = undefined;
		});
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppIndexComponent initialized');

		this.emitter.emitSpinnerStartEvent();
		this.getUserConfig()
			.then(() => this.getGithubProfile())
			.then(() => this.getGithubRepos())
			.then(() => this.getCodepenProfile())
			.then(() => {
				console.log('AppIndex init done');
				this.emitter.emitSpinnerStopEvent();
			})
			.catch((error: any) => {
				console.log('AppIndex init error', error);
				this.emitter.emitSpinnerStopEvent();
			});
	}
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppIndexComponent destroyed');
	}
}
