import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';

import { AppContactComponent } from '../components/app-contact.component';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';

import { UserConfigService } from '../services/user-config.service';
import { GithubService } from '../services/github.service';

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
		githubLanguagesKeys: [] as string[]
	};

	private getUserConfig(): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.userCongigService.getData().subscribe(
			(data: any) => {
				this.data.userConfig = data;
				this.data.links.codewars += data.username.codewars;
				this.data.links.hackerrank += data.username.hackerrank;
				this.data.links.github += data.username.github;
				this.data.links.codepen += data.username.codepen;
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
		this.githubService.getProfile(this.data.userConfig.username.github).subscribe(
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
		this.githubService.getRepos(this.data.userConfig.username.github).subscribe(
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
		this.githubService.getRepoLanguages(this.data.userConfig.username.github, repoName).subscribe(
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

	private dialogInstance: MatDialogRef<AppContactComponent>;
	private dialogSub: any;

	public showContactDialog(): void {
		console.log('TODO: show contact dialog');
		this.dialogInstance = this.dialog.open(AppContactComponent, {
			height: '80vh',
			width: '90vw',
			maxWidth: '1204px',
			maxHeight: '768px',
			disableClose: false,
			data: {
				domain: this.window.location.origin
			}
		});
		this.dialogSub = this.dialogInstance.afterClosed().subscribe((result: any) => {
			console.log('app contact dialog closed with result', result);
			this.dialogSub.unsubscribe();
			this.dialogInstance = undefined;
		});
	}

	public imgShow: any = {
		githubLogo: true as boolean,
		codepenLogo: true as boolean,
		codewarsLogo: true as boolean,
		codewarsBadge: true as boolean,
		hackerrankLogo: true as boolean
	};

	public showImage(imageKey: string): boolean {
		return this.imgShow[imageKey];
	}

	public imgLoaded(imageKey: string): void {
		this.imgShow[imageKey] = true;
	}

	public imgError(imageKey: string): void {
		this.imgShow[imageKey] = false;
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppIndexComponent initialized');

		this.emitter.emitSpinnerStartEvent();
		this.getUserConfig()
			.then(() => this.getGithubProfile())
			.then(() => this.getGithubRepos())
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
