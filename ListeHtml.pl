require RecurseWork;



sub WorkOnFile()
{
 	my $FileName = shift @_;
 	my $UserData = shift @_;

	if ( $FileName =~ /\.html?$/ )
	{
		$FileName =~ s/^$UserData//;
		print "<url  href=\"http://omiscid.gforge.inria.fr/$FileName\"  />\n";
	}
}

if ( ! defined $ARGV[0] || ! -e $ARGV[0] || ! -d $ARGV[0] )
{
	die "Bad parameter\n";
}

$Rep = $ARGV[0];

if ( $Rep =~ /[^\/]$/ )
{
	$Rep .= '/';
}

&RecurseWork::RecurseWork($Rep,$Rep);